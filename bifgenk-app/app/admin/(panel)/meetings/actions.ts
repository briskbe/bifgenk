"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { meeting } from "@/lib/db/schema";
import { isValidDate, isValidTime, meetingTemplate } from "@/lib/meetings";
import { requireAdmin } from "@/lib/session";

export type SaveMeetingResult = { error: string } | { ok: true; updatedAt: string };

type MeetingDetails = {
  title: string;
  date: string;
  startTime: string;
  location: string;
};

type ValidatedDetails = {
  title: string;
  date: string;
  startTime: string | null;
  location: string | null;
};

function validateDetails(details: MeetingDetails): { error: string } | { value: ValidatedDetails } {
  const title = details.title.trim();
  const startTime = details.startTime.trim();
  const location = details.location.trim();

  if (!title) return { error: "Toplantı başlığı boş olamaz." };
  if (title.length > 200) return { error: "Başlık en fazla 200 karakter olabilir." };
  if (!isValidDate(details.date)) return { error: "Geçerli bir tarih seç." };
  if (startTime && !isValidTime(startTime)) return { error: "Geçerli bir saat gir (SS:DD)." };

  return {
    value: { title, date: details.date, startTime: startTime || null, location: location || null },
  };
}

function revalidateMeetings() {
  revalidatePath("/admin", "layout");
}

export async function createMeeting(formData: FormData): Promise<{ error: string }> {
  const { user: me } = await requireAdmin();
  const result = validateDetails({
    title: (formData.get("title") as string) ?? "",
    date: (formData.get("date") as string) ?? "",
    startTime: (formData.get("startTime") as string) ?? "",
    location: (formData.get("location") as string) ?? "",
  });
  if ("error" in result) return { error: result.error };

  const [created] = await db
    .insert(meeting)
    .values({
      ...result.value,
      content: formData.get("template") === "on" ? meetingTemplate() : [],
      createdById: me.id,
      updatedById: me.id,
    })
    .returning({ id: meeting.id });

  revalidateMeetings();
  redirect(`/admin/meetings/${created.id}`);
}

export async function saveMeeting(
  id: string,
  details: MeetingDetails,
  content: unknown[]
): Promise<SaveMeetingResult> {
  const { user: me } = await requireAdmin();
  const result = validateDetails(details);
  if ("error" in result) return { error: result.error };
  if (!Array.isArray(content)) return { error: "Geçersiz içerik." };

  const [updated] = await db
    .update(meeting)
    .set({ ...result.value, content, updatedById: me.id })
    .where(eq(meeting.id, id))
    .returning({ updatedAt: meeting.updatedAt });

  if (!updated) return { error: "Toplantı bulunamadı. Silinmiş olabilir." };

  revalidateMeetings();
  return { ok: true, updatedAt: updated.updatedAt.toISOString() };
}

export async function deleteMeeting(id: string): Promise<{ error: string } | { ok: true }> {
  await requireAdmin();
  await db.delete(meeting).where(eq(meeting.id, id));
  revalidateMeetings();
  return { ok: true };
}
