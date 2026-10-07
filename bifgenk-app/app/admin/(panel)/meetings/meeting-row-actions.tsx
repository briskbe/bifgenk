"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Download04Icon, MoreHorizontalIcon, NoteEditIcon } from "@hugeicons/core-free-icons";
import { deleteMeeting } from "./actions";
import { ActionDialog } from "../action-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MeetingRowActions({ meeting }: { meeting: { id: string; title: string } }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`${meeting.title} için işlemler`}>
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/meetings/${meeting.id}`}>
              <HugeiconsIcon icon={NoteEditIcon} strokeWidth={2} />
              Notları aç
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`/admin/meetings/${meeting.id}/pdf?download`}>
              <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
              PDF indir
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Toplantıyı sil"
        description={`"${meeting.title}" ve tüm notları kalıcı olarak silinecek.`}
        submitLabel="Sil"
        destructive
        onSubmit={() => deleteMeeting(meeting.id)}
      />
    </>
  );
}
