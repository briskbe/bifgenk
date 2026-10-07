"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { createMeeting } from "./actions";
import { ActionDialog } from "../action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/meetings";

export function NewMeetingButton({ size = "default" }: { size?: "default" | "lg" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Yeni toplantı
      </Button>
      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title="Yeni toplantı"
        description="Temel bilgileri gir; notları bir sonraki adımda editörde yazarsın."
        submitLabel="Oluştur ve notlara geç"
        onSubmit={createMeeting}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Başlık</Label>
            <Input
              id="meeting-title"
              name="title"
              required
              maxLength={200}
              placeholder="ör. Haftalık yönetim toplantısı"
              className="h-11"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Tarih</Label>
              <Input id="meeting-date" name="date" type="date" required defaultValue={todayISO()} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Saat (isteğe bağlı)</Label>
              <Input id="meeting-time" name="startTime" type="time" className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-location">Yer (isteğe bağlı)</Label>
            <Input id="meeting-location" name="location" placeholder="ör. BIF Genk lokali" className="h-11" />
          </div>
          <label className="flex items-start gap-3 rounded-2xl border bg-muted/40 p-3 text-sm">
            <input type="checkbox" name="template" defaultChecked className="mt-0.5 size-4 accent-primary" />
            <span>
              <span className="font-medium">Toplantı şablonuyla başla</span>
              <span className="block text-muted-foreground">
                Katılımcılar, Gündem, Notlar, Alınan kararlar ve Yapılacaklar bölümleri hazır gelir.
              </span>
            </span>
          </label>
        </div>
      </ActionDialog>
    </>
  );
}
