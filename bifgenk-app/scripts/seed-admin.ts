/**
 * Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD, or promotes it
 * to admin if it already exists. Safe to run on every deploy: an existing
 * account's password is never overwritten.
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("seed-admin: ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping.");
    return;
  }

  const { eq } = await import("drizzle-orm");
  const { auth } = await import("../lib/auth");
  const { db } = await import("../lib/db");
  const { user } = await import("../lib/db/schema");

  const [existing] = await db.select().from(user).where(eq(user.email, email));

  if (existing) {
    if (existing.role !== "admin") {
      await db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id));
      console.log(`seed-admin: promoted ${email} to admin.`);
    } else {
      console.log(`seed-admin: ${email} is already an admin.`);
    }
    return;
  }

  await auth.api.createUser({
    body: { email, password, name: "Yönetici", role: "admin" },
  });
  console.log(`seed-admin: created admin ${email}.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("seed-admin failed:", error);
    process.exit(1);
  });
