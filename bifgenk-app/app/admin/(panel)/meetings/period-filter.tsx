"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MEETING_PERIODS,
  formatDateRange,
  isMeetingPeriod,
  meetingsHref,
  type MeetingFilters,
  type MeetingPeriod,
} from "@/lib/meetings";
import { cn } from "@/lib/utils";
import { useMeetingsNavigation } from "./meetings-navigation";

/** Plain left click without modifiers: handle in-app; otherwise let the browser open a tab etc. */
function isPlainClick(e: React.MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
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
  const { href, navigate } = useMeetingsNavigation();
  const optimisticParam = new URLSearchParams(href.split("?")[1] ?? "").get("period") ?? undefined;
  const activePeriod: MeetingPeriod | undefined = isMeetingPeriod(optimisticParam) ? optimisticParam : undefined;
  const chips: { value?: MeetingPeriod; label: string }[] = [{ label: "Tümü" }, ...MEETING_PERIODS];

  function submitCustom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    navigate(
      meetingsHref({
        q: filters.q,
        period: "custom",
        from: (data.get("from") as string) || undefined,
        to: (data.get("to") as string) || undefined,
      })
    );
  }

  return (
    <div className="space-y-3">
      <nav aria-label="Tarih filtresi" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = activePeriod === chip.value;
          const target = meetingsHref({ q: filters.q, period: chip.value, from: filters.from, to: filters.to });
          return (
            <a
              key={chip.label}
              href={target}
              onClick={(e) => {
                if (!isPlainClick(e)) return;
                e.preventDefault();
                navigate(target);
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              {chip.label}
            </a>
          );
        })}
      </nav>

      {activePeriod === "custom" && (
        <form
          action="/admin/meetings"
          onSubmit={submitCustom}
          className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4"
        >
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

/** Search box that keeps the active date filter. */
export function MeetingSearch({ filters }: { filters: MeetingFilters }) {
  const { navigate } = useMeetingsNavigation();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = ((new FormData(e.currentTarget).get("q") as string) ?? "").trim();
    navigate(meetingsHref({ ...filters, q }));
  }

  return (
    <form className="flex gap-2" action="/admin/meetings" onSubmit={submit}>
      <Input name="q" defaultValue={filters.q} placeholder="Başlık veya yer ara" className="h-10 max-w-sm bg-card" />
      <Button type="submit" variant="outline">
        Ara
      </Button>
      {filters.q && (
        <Button variant="ghost" type="button" onClick={() => navigate(meetingsHref({ ...filters, q: "" }))}>
          Temizle
        </Button>
      )}
    </form>
  );
}
