import Link from "next/link";
import { asc, count, desc, eq, gte, lt } from "drizzle-orm";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Calendar03Icon,
  Megaphone01Icon,
  UserGroupIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { db } from "@/lib/db";
import { announcement, meeting, user } from "@/lib/db/schema";
import { formatMeetingDate, meetingDateParts, todayISO } from "@/lib/meetings";
import { requireAdmin } from "@/lib/session";
import { NewMeetingButton } from "./meetings/new-meeting-button";

export default async function AdminOverviewPage() {
  const { user: me } = await requireAdmin();
  const today = todayISO();

  const [[{ members }], [{ meetings }], [{ announcements }], upcoming, recent, latestAnnouncements] =
    await Promise.all([
      db.select({ members: count() }).from(user),
      db.select({ meetings: count() }).from(meeting),
      db.select({ announcements: count() }).from(announcement),
      db
        .select()
        .from(meeting)
        .where(gte(meeting.date, today))
        .orderBy(asc(meeting.date), asc(meeting.startTime))
        .limit(3),
      db.select().from(meeting).where(lt(meeting.date, today)).orderBy(desc(meeting.date)).limit(5),
      db.select().from(announcement).orderBy(desc(announcement.createdAt)).limit(3),
    ]);
  const [[{ admins }], [{ upcomingCount }]] = await Promise.all([
    db.select({ admins: count() }).from(user).where(eq(user.role, "admin")),
    db.select({ upcomingCount: count() }).from(meeting).where(gte(meeting.date, today)),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Hoş geldin, {me.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">
            {formatMeetingDate(today)} · BIF Genk yönetim paneline genel bakış.
          </p>
        </div>
        <NewMeetingButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard href="/admin/users" icon={UserGroupIcon} label="Üyeler" value={members} hint={`${admins} yönetici`} />
        <StatCard href="/admin/meetings" icon={Calendar03Icon} label="Toplantılar" value={meetings} hint={`${upcomingCount} yaklaşan`} />
        <StatCard href="/admin/announcements" icon={Megaphone01Icon} label="Duyurular" value={announcements} hint="Tüm üyelere görünür" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="space-y-4 rounded-2xl border bg-card p-6 lg:col-span-3">
          <SectionHeader title="Toplantılar" href="/admin/meetings" />
          {upcoming.length === 0 && recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Henüz toplantı yok.</p>
          ) : (
            <ul className="divide-y">
              {[...upcoming, ...recent].map((m) => {
                const parts = meetingDateParts(m.date);
                const isUpcoming = m.date >= today;
                return (
                  <li key={m.id}>
                    <Link
                      href={`/admin/meetings/${m.id}`}
                      className="-mx-2 flex items-center gap-4 rounded-xl px-2 py-3 hover:bg-muted/60"
                    >
                      <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-primary/10 py-1.5 text-primary">
                        <span className="text-lg font-bold leading-none">{parts.day}</span>
                        <span className="text-[10px] font-semibold uppercase">{parts.month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{m.title}</p>
                        <p className="truncate text-xs text-muted-foreground capitalize">
                          {parts.weekday}
                          {m.startTime && ` · ${m.startTime}`}
                          {m.location && ` · ${m.location}`}
                        </p>
                      </div>
                      {isUpcoming && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {m.date === today ? "Bugün" : "Yaklaşan"}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-6 lg:col-span-2">
          <SectionHeader title="Son duyurular" href="/admin/announcements" />
          {latestAnnouncements.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Henüz duyuru yok.</p>
          ) : (
            <ul className="space-y-4">
              {latestAnnouncements.map((a) => (
                <li key={a.id} className="space-y-1">
                  <p className="font-medium leading-snug">{a.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.content}</p>
                  <p className="text-xs text-muted-foreground/80">
                    {a.createdAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", timeZone: "Europe/Brussels" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  href,
  icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: IconSvgElement;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Link href={href} className="group rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4.5" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-bold">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        Tümü
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
      </Link>
    </div>
  );
}
