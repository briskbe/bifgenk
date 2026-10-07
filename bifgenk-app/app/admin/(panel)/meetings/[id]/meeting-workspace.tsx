"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
  useMutation,
  useOthers,
  useSelf,
  useStatus,
  useStorage,
} from "@liveblocks/react/suspense";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  Download04Icon,
  Location01Icon,
  MoreHorizontalIcon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import type { MeetingDetails } from "@/liveblocks.config";
import { deleteMeeting, saveMeeting } from "../actions";
import { ActionDialog } from "../../action-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatMeetingDate } from "@/lib/meetings";
import { cn } from "@/lib/utils";

const MeetingEditor = dynamic(() => import("@/components/meeting-editor/meeting-editor"), {
  ssr: false,
  loading: () => <LoadingLines />,
});

type MeetingData = MeetingDetails & {
  id: string;
  roomId: string;
  content: unknown[];
  updatedAt: string;
  updatedByName: string | null;
};

type SaveState =
  | { status: "saved"; at: string }
  | { status: "dirty" }
  | { status: "saving" }
  | { status: "error"; message: string };

const AUTOSAVE_DELAY = 1500;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Meeting notes page. Everyone who has the meeting open edits the same live
 * document through Liveblocks; each person's own edits are also saved to our
 * database (for the list, overview and PDF export).
 */
export function MeetingWorkspace({ meeting }: { meeting: MeetingData }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
      <RoomProvider
        id={meeting.roomId}
        initialPresence={{}}
        initialStorage={{
          details: new LiveObject({
            title: meeting.title,
            date: meeting.date,
            startTime: meeting.startTime,
            location: meeting.location,
          }),
        }}
      >
        <ClientSideSuspense fallback={<WorkspaceSkeleton />}>
          <LiveMeeting meeting={meeting} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function LiveMeeting({ meeting }: { meeting: MeetingData }) {
  const router = useRouter();
  const details = useStorage((root) => root.details);
  const [saveState, setSaveState] = useState<SaveState>({ status: "saved", at: meeting.updatedAt });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useErrorListener((error) => {
    if (error.context.type !== "ROOM_CONNECTION_ERROR") return;
    setConnectionError(
      // 4001: the auth endpoint refused (e.g. signed out or no longer an admin).
      error.context.code === 4001
        ? "Bu toplantıya bağlanma yetkin yok. Tekrar giriş yapmayı dene."
        : "Canlı bağlantıda bir sorun oluştu. Sayfayı yenile."
    );
  });

  // Latest values live in refs so autosave always sends what's on screen.
  const detailsRef = useRef(details);
  detailsRef.current = details;
  const contentRef = useRef<unknown[]>(meeting.content);
  const versionRef = useRef(0);
  const savedVersionRef = useRef(0);
  const savingRef = useRef<Promise<boolean> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (): Promise<boolean> => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Wait for an in-flight save, then save again if anything changed since.
    if (savingRef.current) await savingRef.current;
    if (versionRef.current === savedVersionRef.current) return true;

    const version = versionRef.current;
    setSaveState({ status: "saving" });
    const run = (async () => {
      try {
        const result = await saveMeeting(meeting.id, { ...detailsRef.current }, contentRef.current);
        if ("error" in result) {
          setSaveState({ status: "error", message: result.error });
          return false;
        }
        savedVersionRef.current = version;
        setSaveState(
          versionRef.current === version ? { status: "saved", at: result.updatedAt } : { status: "dirty" }
        );
        return true;
      } catch {
        setSaveState({ status: "error", message: "Kaydedilemedi. Bağlantını kontrol et." });
        return false;
      } finally {
        savingRef.current = null;
      }
    })();
    savingRef.current = run;
    return run;
  }, [meeting.id]);

  const markDirty = useCallback(() => {
    versionRef.current += 1;
    // Keep the same state object while already dirty to avoid a re-render per keystroke.
    setSaveState((prev) => (prev.status === "dirty" ? prev : { status: "dirty" }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Only autosave valid details; the error is shown inline until fixed.
      if (detailsRef.current.title.trim() && detailsRef.current.date) void save();
    }, AUTOSAVE_DELAY);
  }, [save]);

  const updateDetails = useMutation(
    ({ storage }, patch: Partial<MeetingDetails>) => {
      storage.get("details").update(patch);
    },
    []
  );

  function editDetails(patch: Partial<MeetingDetails>) {
    updateDetails(patch);
    detailsRef.current = { ...detailsRef.current, ...patch };
    markDirty();
  }

  const handleContentChange = useCallback(
    (content: unknown[], local: boolean) => {
      contentRef.current = content;
      // Other people's edits are saved by their own browsers.
      if (local) markDirty();
    },
    [markDirty]
  );

  // Ctrl/Cmd+S saves immediately.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [save]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (versionRef.current !== savedVersionRef.current) e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  async function openPdf(download: boolean) {
    // Open the tab synchronously so pop-up blockers allow it, then point it at the PDF.
    const tab = download ? null : window.open("about:blank", "_blank");
    // Always save first so the PDF includes everyone's latest edits.
    versionRef.current += 1;
    const ok = await save();
    if (!ok) {
      tab?.close();
      return;
    }
    const url = `/admin/meetings/${meeting.id}/pdf${download ? "?download" : ""}`;
    if (tab) tab.location.href = url;
    else window.location.href = url;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/admin/meetings">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            Toplantılar
          </Link>
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <PresenceAvatars />
          <SaveIndicator state={saveState} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => void save()}
            disabled={saveState.status === "saving" || saveState.status === "saved"}
          >
            Kaydet
          </Button>
          <Button size="sm" onClick={() => void openPdf(true)}>
            <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
            PDF indir
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Diğer işlemler">
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => void openPdf(false)}>
                <HugeiconsIcon icon={Pdf01Icon} strokeWidth={2} />
                PDF önizle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                Toplantıyı sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {connectionError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {connectionError}
        </div>
      )}

      {/* Paper */}
      <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="h-1.5 bg-primary" />
        <div className="px-6 pb-16 pt-10 sm:px-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Toplantı notları</p>
          <textarea
            value={details.title}
            onChange={(e) => editDetails({ title: e.target.value.replace(/\n/g, " ") })}
            placeholder="Adsız toplantı"
            rows={1}
            maxLength={200}
            aria-label="Toplantı başlığı"
            className="field-sizing-content w-full resize-none bg-transparent text-3xl font-bold leading-tight tracking-tight outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
          />

          <dl className="mt-6 grid gap-1 text-sm">
            <PropertyRow icon={Calendar03Icon} label="Tarih">
              <input
                type="date"
                required
                value={details.date}
                onChange={(e) => editDetails({ date: e.target.value })}
                className="rounded-lg bg-transparent px-2 py-1 outline-none hover:bg-muted focus:bg-muted"
              />
              {details.date && <span className="text-muted-foreground">{formatMeetingDate(details.date)}</span>}
            </PropertyRow>
            <PropertyRow icon={Clock01Icon} label="Saat">
              <input
                type="time"
                value={details.startTime}
                onChange={(e) => editDetails({ startTime: e.target.value })}
                className="rounded-lg bg-transparent px-2 py-1 outline-none hover:bg-muted focus:bg-muted"
              />
            </PropertyRow>
            <PropertyRow icon={Location01Icon} label="Yer">
              <input
                type="text"
                value={details.location}
                onChange={(e) => editDetails({ location: e.target.value })}
                placeholder="Boş"
                className="w-full rounded-lg bg-transparent px-2 py-1 outline-none placeholder:text-muted-foreground/60 hover:bg-muted focus:bg-muted"
              />
            </PropertyRow>
          </dl>

          <div className="my-6 border-t" />

          {/* BlockNote adds its own horizontal padding for the side menu; pull it back to align. */}
          <div className="-mx-[54px]">
            <MeetingEditor onChange={handleContentChange} />
          </div>
        </div>
      </article>

      <p className="text-center text-xs text-muted-foreground">
        Komutlar için <kbd className="rounded border bg-muted px-1">/</kbd> yaz · Biçimlendirmek için metni seç ·
        Kaydetmek için <kbd className="rounded border bg-muted px-1">Ctrl</kbd>+<kbd className="rounded border bg-muted px-1">S</kbd>
        {meeting.updatedByName && <> · Son kaydeden: {meeting.updatedByName}</>}
      </p>

      <ActionDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Toplantıyı sil"
        description={`"${details.title || "Adsız toplantı"}" ve tüm notları kalıcı olarak silinecek.`}
        submitLabel="Sil"
        destructive
        onSubmit={async () => {
          const result = await deleteMeeting(meeting.id);
          if ("ok" in result) {
            // Nothing left to save.
            savedVersionRef.current = versionRef.current;
            router.push("/admin/meetings");
          }
          return result;
        }}
      />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Avatars of everyone who has this meeting open, plus the live connection state. */
function PresenceAvatars() {
  const self = useSelf();
  const others = useOthers();
  const status = useStatus();
  const visible = others.slice(0, 4);
  const hidden = others.length - visible.length;
  const live = status === "connected";

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((other) => (
          <Tooltip key={other.connectionId}>
            <TooltipTrigger asChild>
              <span
                className="flex size-8 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold text-white"
                style={{ backgroundColor: other.info.color }}
              >
                {initials(other.info.name)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {other.info.name}
              {other.id === self.id && " (başka bir sekme)"}
            </TooltipContent>
          </Tooltip>
        ))}
        {hidden > 0 && (
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-semibold">
            +{hidden}
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="flex size-8 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold text-white ring-2 ring-primary/30"
              style={{ backgroundColor: self.info.color }}
            >
              {initials(self.info.name)}
            </span>
          </TooltipTrigger>
          <TooltipContent>Sen ({self.info.name})</TooltipContent>
        </Tooltip>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn("size-2 rounded-full", live ? "bg-primary" : "animate-pulse bg-amber-500")}
            aria-label={live ? "Canlı bağlı" : "Bağlanıyor"}
          />
        </TooltipTrigger>
        <TooltipContent>
          {live
            ? others.length
              ? `Canlı · ${others.length + 1} kişi düzenliyor`
              : "Canlı · değişiklikler anında paylaşılır"
            : "Bağlanıyor…"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: typeof Calendar03Icon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-9 items-center gap-2">
      <dt className="flex w-28 shrink-0 items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4" />
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 items-center gap-2">{children}</dd>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  const text =
    state.status === "saved"
      ? `Kaydedildi · ${formatTime(state.at)}`
      : state.status === "saving"
        ? "Kaydediliyor…"
        : state.status === "dirty"
          ? "Kaydedilmemiş değişiklikler"
          : state.message;

  return (
    <span
      role="status"
      className={cn(
        "hidden items-center gap-1.5 text-xs sm:flex",
        state.status === "error" ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {state.status === "saved" && (
        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3.5 text-primary" />
      )}
      {state.status === "saving" && <span className="size-2 animate-pulse rounded-full bg-primary" />}
      {state.status === "dirty" && <span className="size-2 rounded-full bg-amber-500" />}
      {text}
    </span>
  );
}

function LoadingLines() {
  return (
    <div className="space-y-3 px-[54px] py-2" aria-hidden>
      <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4" aria-busy>
      <div className="h-8" />
      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="h-1.5 bg-primary" />
        <div className="space-y-4 px-6 pb-16 pt-10 sm:px-14">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
          <p className="pt-4 text-sm text-muted-foreground">Canlı oturuma bağlanılıyor…</p>
        </div>
      </div>
    </div>
  );
}
