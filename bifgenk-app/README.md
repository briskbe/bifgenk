# BIF Genk app

Next.js app with member accounts, an admin panel (`/admin`) and announcements.
Everything runs on Vercel: the database is Neon Postgres added through the
Vercel Marketplace, and auth is handled in-app by [Better Auth](https://better-auth.com).

## Deploying on Vercel

1. In the Vercel project, open **Storage → Create Database → Neon** and connect it.
   This adds `DATABASE_URL` (and `DATABASE_URL_UNPOOLED`) automatically.
2. In **Settings → Environment Variables**, add:
   - `BETTER_AUTH_SECRET`: a random string (`openssl rand -base64 32`)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: the first admin account
3. Deploy. Every build runs database migrations and creates the admin account
   if it doesn't exist yet (`npm run build`).

`ADMIN_PASSWORD` is only used when the account is first created. To change it
later, use **Şifre belirle** in the admin panel.

## Local development

```bash
vercel env pull .env.local   # or copy .env.example and fill it in
npm install
npm run db:migrate
npm run db:seed-admin
npm run dev
```

## Database

Tables are defined in `lib/db/schema.ts`. After changing it:

```bash
npm run db:generate   # writes a new SQL migration to drizzle/
npm run db:migrate    # applies it
```

`npm run db:studio` opens a browser UI for the database.
