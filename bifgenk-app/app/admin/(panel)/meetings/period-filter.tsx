import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEETING_PERIODS, formatDateRange, type MeetingPeriod } from "@/lib/meetings";
import { cn } from "@/lib/utils";

export type MeetingFilters = {
  q: string;
  period?: MeetingPeriod;
  from?: string;
  to?: string;
};

/** URL for the meetings list with the given filters (empty values dropped). */
export function meetingsHref(filters: MeetingFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.period) params.set("period", filters.period);
  if (filters.period === "custom") {
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
  }
  const qs = params.toString();
  return qs ? `/admin/meetings?${qs}` : "/admin/meetings";
}

export function PeriodFilter({
  filters,
  range,
  count,
}: {
  filters: MeetingFilters;
  range: { from?: string; to?: string };
  count: number;
}) {
  const chips: { value?: MeetingPeriod; label: string }[] = [{ label: "Tümü" }, ...MEETING_PERIODS];

  return (
    <div className="space-y-3">
      <nav aria-label="Tarih filtresi" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = filters.period === chip.value;
          return (
            <Link
              key={chip.label}
              href={meetingsHref({ q: filters.q, period: chip.value, from: filters.from, to: filters.to })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              {chip.label}
            </Link>
          );
        })}
      </nav>

      {filters.period === "custom" && (
        <form
          action="/admin/meetings"
          className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4"
        >
          <input type="hidden" name="period" value="custom" />
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <div className="space-y-1.5">
            <Label htmlFor="filter-from" className="text-xs text-muted-foreground">
              Başlangıç
            </Label>
            <Input id="filter-from" name="from" type="date" defaultValue={range.from} className="h-10 w-44" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-to" className="text-xs text-muted-foreground">
              Bitiş
            </Label>
            <Input id="filter-to" name="to" type="date" defaultValue={range.to} className="h-10 w-44" />
          </div>
          <Button type="submit">Uygula</Button>
        </form>
      )}

      {filters.period && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
          <span>
            <span className="font-medium text-foreground">{formatDateRange(range)}</span> · {count} toplantı
          </span>
        </p>
      )}
    </div>
  );
}
