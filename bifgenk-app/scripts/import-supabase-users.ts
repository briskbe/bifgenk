/**
 * Copies member accounts from the old Supabase project into this database.
 * Runs on every build while SUPABASE_DB_URL is set, and does nothing otherwise.
 * Passwords keep working: Supabase's bcrypt hashes are copied as-is and
 * lib/auth.ts verifies them. Members that already exist (same email) are
 * skipped, so the script is safe to run more than once.
 *
 *   SUPABASE_DB_URL="postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres" \
 *     npm run db:import-supabase -- [--dry-run]
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

type SupabaseUser = {
  id: string;
  email: string;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
  full_name: string | null;
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const sourceUrl = process.env.SUPABASE_DB_URL;
  if (!sourceUrl) {
    console.log("import-supabase: SUPABASE_DB_URL not set, skipping.");
    return;
  }

  const { default: postgres } = await import("postgres");
  const { inArray } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { account, user } = await import("../lib/db/schema");

  const local = /localhost|127\.0\.0\.1/.test(sourceUrl);
  const source = postgres(sourceUrl, { ssl: local ? false : "require", prepare: false, max: 1 });

  try {
    const rows = await source<SupabaseUser[]>`
      select id::text, lower(email) as email, encrypted_password, email_confirmed_at,
             created_at, updated_at, raw_user_meta_data->>'full_name' as full_name
      from auth.users
      where email is not null and deleted_at is null
      order by created_at`;

    const existing = new Set(
      rows.length
        ? (
            await db
              .select({ email: user.email })
              .from(user)
              .where(inArray(user.email, rows.map((r) => r.email)))
          ).map((r) => r.email)
        : []
    );

    const toImport = rows.filter((r) => !existing.has(r.email));
    console.log(
      `Supabase: ${rows.length} members · already here: ${existing.size} · to import: ${toImport.length}`
    );

    for (const r of toImport) {
      const name = r.full_name?.trim() || r.email.split("@")[0];
      const hasPassword = Boolean(r.encrypted_password);
      console.log(`  ${dryRun ? "would import" : "importing"} ${r.email} (${name})${hasPassword ? "" : " — no password"}`);
      if (dryRun) continue;

      await db.transaction(async (tx) => {
        await tx.insert(user).values({
          id: r.id,
          name,
          email: r.email,
          emailVerified: r.email_confirmed_at !== null,
          role: "user",
          createdAt: r.created_at,
          updatedAt: r.updated_at ?? r.created_at,
        });
        if (hasPassword) {
          await tx.insert(account).values({
            id: crypto.randomUUID(),
            accountId: r.id,
            providerId: "credential",
            userId: r.id,
            password: r.encrypted_password,
            createdAt: r.created_at,
            updatedAt: r.updated_at ?? r.created_at,
          });
        }
      });
    }

    console.log(dryRun ? "Dry run: nothing was written." : `Imported ${toImport.length} members.`);
  } finally {
    await source.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("import failed:", error);
    process.exit(1);
  });
