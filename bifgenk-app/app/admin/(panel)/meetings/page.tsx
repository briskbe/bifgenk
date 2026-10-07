import Link from "next/link";
import { and, asc, desc, gte, ilike, lt, lte, or } from "drizzle-orm";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { db } from "@/lib/db";
import { meeting, type Meeting } from "@/lib/db/schema";
import {
  isMeetingPeriod,
  meetingDateParts,
  meetingExcerpt,
  meetingPeriodRange,
  todayISO,
} from "@/lib/meetings";
import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MeetingRowActions } from "./meeting-row-actions";
import { NewMeetingButton } from "./new-meeting-button";
import { PeriodFilter, meetingsHref, type MeetingFilters } from "./period-filter";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; period?: string; from?: string; to?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const period = isMeetingPeriod(params.period) ? params.period : undefined;
  const today = todayISO();
  const range = period ? meetingPeriodRange(period, today, { from: params.from, to: params.to }) : {};
  const filters: MeetingFilters = { q: query, period, from: range.from, to: range.to };

  const search = and(
    query ? or(ilike(meeting.title, `%${query}%`), ilike(meeting.location, `%${query}%`)) : undefined,
    range.from ? gte(meeting.date, range.from) : undefined,
    range.to ? lte(meeting.date, range.to) : undefined
  );

  const [upcoming, past] = await Promise.all([
    db
      .select()
      .from(meeting)
      .where(and(gte(meeting.date, today), search))
      .orderBy(asc(meeting.date), asc(meeting.startTime)),
    db
      .select()
      .from(meeting)
      .where(and(lt(meeting.date, today), search))
      .orderBy(desc(meeting.date), desc(meeting.startTime)),
  ]);

  const isEmpty = upcoming.length === 0 && past.length === 0;
  const isFiltered = Boolean(query || period);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Toplantılar</h1>
          <p className="text-sm text-muted-foreground">
            Toplantı notlarını yaz, düzenle ve markalı PDF olarak dışa aktar.
          </p>
        </div>
        <NewMeetingButton />
      </div>

      <form className="flex gap-2" action="/admin/meetings">
        {/* Keep the date filter when searching. */}
        {period && <input type="hidden" name="period" value={period} />}
        {period === "custom" && range.from && <input type="hidden" name="from" value={range.from} />}
        {period === "custom" && range.to && <input type="hidden" name="to" value={range.to} />}
        <Input
          name="q"
          defaultValue={query}
          placeholder="Başlık veya yer ara"
          className="h-10 max-w-sm bg-card"
        />
        <Button type="submit" variant="outline">
          Ara
        </Button>
        {query && (
          <Button asChild variant="ghost">
            <Link href={meetingsHref({ ...filters, q: "" })}>Temizle</Link>
          </Button>
        )}
      </form>

      <PeriodFilter filters={filters} range={range} count={upcoming.length + past.length} />

      {isEmpty ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">
              {query ? "Aramanla eşleşen toplantı yok" : period ? "Bu dönemde toplantı yok" : "Henüz toplantı yok"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFiltered
                ? "Farklı bir arama veya tarih aralığı dene."
                : "İlk toplantını oluştur ve notlarını Notion tarzı editörde yaz."}
            </p>
          </div>
          {isFiltered ? (
            <Button asChild variant="outline">
              <Link href="/admin/meetings">Filtreleri temizle</Link>
            </Button>
          ) : (
            <NewMeetingButton />
          )}
        </div>
      ) : (
        <>
          {upcoming.length > 0 && <MeetingSection title="Yaklaşan" meetings={upcoming} today={today} />}
          {past.length > 0 && <MeetingSection title="Geçmiş toplantılar" meetings={past} today={today} />}
        </>
      )}
    </div>
  );
}

function MeetingSection({ title, meetings, today }: { title: string; meetings: Meeting[]; today: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title} <span className="text-muted-foreground/60">({meetings.length})</span>
      </h2>
      <ul className="space-y-3">
        {meetings.map((m) => (
          <MeetingCard key={m.id} meeting={m} isToday={m.date === today} />
        ))}
      </ul>
    </section>
  );
}

function MeetingCard({ meeting: m, isToday }: { meeting: Meeting; isToday: boolean }) {
  const parts = meetingDateParts(m.date);
  const excerpt = meetingExcerpt(m.content);

  return (
    <li className="group relative flex gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md sm:gap-5 sm:p-5">
      <div
        className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-2 ${
          isToday ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        }`}
      >
        <span className="text-2xl font-bold leading-none">{parts.day}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide">{parts.month}</span>
        <span className="text-[10px] opacity-70">{parts.year}</span>
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start gap-2">
          <Link
            href={`/admin/meetings/${m.id}`}
            className="font-semibold leading-snug after:absolute after:inset-0 hover:underline"
          >
            {m.title}
          </Link>
          {isToday && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Bugün
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="capitalize">{parts.weekday}</span>
          {m.startTime && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3.5" />
              {m.startTime}
            </span>
          )}
          {m.location && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-3.5" />
              {m.location}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {excerpt || <span className="italic">Henüz not yok.</span>}
        </p>
      </div>

      <div className="relative z-10 shrink-0 self-start">
        <MeetingRowActions meeting={{ id: m.id, title: m.title }} />
      </div>
    </li>
  );
}
