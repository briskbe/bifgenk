"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-errors";
import { db } from "@/lib/db";
import { announcement, user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";

export type ActionResult = { error: string } | { ok: true };

const OK: ActionResult = { ok: true };

function text(formData: FormData, key: string) {
  return ((formData.get(key) as string | null) ?? "").trim();
}

// ── Session ────────────────────────────────────────────────────────────────

export async function adminLogin(formData: FormData): Promise<ActionResult> {
  const email = text(formData, "email").toLowerCase();
  const password = formData.get("password") as string;

  // Only admins may sign in here. Non-admins get the same message as a wrong
  // password so this form doesn't reveal which emails belong to admins.
  const [account] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.email, email));
  if (account?.role !== "admin") {
    return { error: "E-posta veya şifre hatalı." };
  }

  try {
    await auth.api.signInEmail({ body: { email, password }, headers: await headers() });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }

  redirect("/admin");
}

export async function adminLogout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}

// ── Users ──────────────────────────────────────────────────────────────────

async function run(action: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await action();
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  revalidatePath("/admin", "layout");
  return OK;
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const name = text(formData, "name");
  const email = text(formData, "email");
  const password = formData.get("password") as string;
  const role = formData.get("role") === "admin" ? "admin" : "user";

  if (!name || !email) return { error: "Ad ve e-posta zorunlu." };

  return run(async () =>
    auth.api.createUser({
      body: { name, email, password, role },
      headers: await headers(),
    })
  );
}

export async function setUserRole(userId: string, role: "admin" | "user"): Promise<ActionResult> {
  const { user: me } = await requireAdmin();
  if (userId === me.id) return { error: "Kendi rolünü değiştiremezsin." };

  return run(async () => auth.api.setRole({ body: { userId, role }, headers: await headers() }));
}

export async function banUser(userId: string, reason: string): Promise<ActionResult> {
  await requireAdmin();
  return run(async () =>
    auth.api.banUser({
      body: { userId, banReason: reason.trim() || undefined },
      headers: await headers(),
    })
  );
}

export async function unbanUser(userId: string): Promise<ActionResult> {
  await requireAdmin();
  return run(async () => auth.api.unbanUser({ body: { userId }, headers: await headers() }));
}

export async function setUserPassword(userId: string, newPassword: string): Promise<ActionResult> {
  await requireAdmin();
  return run(async () =>
    auth.api.setUserPassword({ body: { userId, newPassword }, headers: await headers() })
  );
}

export async function removeUser(userId: string): Promise<ActionResult> {
  await requireAdmin();
  return run(async () => auth.api.removeUser({ body: { userId }, headers: await headers() }));
}

// ── Announcements ─────────────────────────────────────────────────────────

function announcementInput(formData: FormData) {
  const title = text(formData, "title");
  const content = text(formData, "content");
  if (!title || !content) return null;
  return { title, content };
}

function revalidateAnnouncements() {
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard");
}

export async function createAnnouncement(formData: FormData): Promise<ActionResult> {
  const { user: me } = await requireAdmin();
  const input = announcementInput(formData);
  if (!input) return { error: "Başlık ve içerik zorunlu." };

  await db.insert(announcement).values({ ...input, authorId: me.id });
  revalidateAnnouncements();
  return OK;
}

export async function updateAnnouncement(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const input = announcementInput(formData);
  if (!input) return { error: "Başlık ve içerik zorunlu." };

  await db.update(announcement).set(input).where(eq(announcement.id, id));
  revalidateAnnouncements();
  return OK;
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(announcement).where(eq(announcement.id, id));
  revalidateAnnouncements();
  return OK;
}
