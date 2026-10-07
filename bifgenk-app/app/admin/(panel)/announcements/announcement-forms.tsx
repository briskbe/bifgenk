"use client";

import { useRef, useState, useTransition } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "../../actions";
import { ActionDialog } from "../action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function AnnouncementFields({
  idPrefix,
  defaults,
}: {
  idPrefix: string;
  defaults?: { title: string; content: string };
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Başlık</Label>
        <Input
          id={`${idPrefix}-title`}
          name="title"
          required
          maxLength={200}
          defaultValue={defaults?.title}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-content`}>İçerik</Label>
        <Textarea
          id={`${idPrefix}-content`}
          name="content"
          required
          rows={6}
          defaultValue={defaults?.content}
          className="min-h-32"
        />
      </div>
    </div>
  );
}

export function NewAnnouncementForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createAnnouncement(formData);
      if ("error" in result) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <AnnouncementFields idPrefix="new" />
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Yayınlanıyor..." : "Yayınla"}
      </Button>
    </form>
  );
}

type AnnouncementRow = { id: string; title: string; content: string };

export function AnnouncementActions({ announcement }: { announcement: AnnouncementRow }) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Duyuru işlemleri">
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => setDialog("edit")}>Düzenle</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDialog("delete")}>
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog
        open={dialog === "edit"}
        onOpenChange={(open) => setDialog(open ? "edit" : null)}
        title="Duyuruyu düzenle"
        submitLabel="Kaydet"
        onSubmit={(formData) => updateAnnouncement(announcement.id, formData)}
      >
        <AnnouncementFields idPrefix={`edit-${announcement.id}`} defaults={announcement} />
      </ActionDialog>

      <ActionDialog
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
        title="Duyuruyu sil"
        description={`"${announcement.title}" kalıcı olarak silinecek.`}
        submitLabel="Sil"
        destructive
        onSubmit={() => deleteAnnouncement(announcement.id)}
      />
    </>
  );
}
