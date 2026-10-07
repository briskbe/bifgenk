"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import {
  banUser,
  createUser,
  removeUser,
  setUserPassword,
  setUserRole,
  unbanUser,
} from "../actions";
import { ActionDialog } from "./action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const selectClassName =
  "h-11 w-full rounded-4xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function CreateUserButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
        Üye ekle
      </Button>
      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title="Yeni üye"
        description="Hesap hemen aktif olur. Şifreyi üyeyle güvenli bir şekilde paylaş."
        submitLabel="Oluştur"
        onSubmit={createUser}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-name">Ad Soyad</Label>
            <Input id="new-name" name="name" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">E-posta</Label>
            <Input id="new-email" name="email" type="email" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Şifre</Label>
            <Input
              id="new-password"
              name="password"
              type="password"
              minLength={6}
              required
              autoComplete="new-password"
              placeholder="En az 6 karakter"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-role">Rol</Label>
            <select id="new-role" name="role" defaultValue="user" className={selectClassName}>
              <option value="user">Üye</option>
              <option value="admin">Yönetici</option>
            </select>
          </div>
        </div>
      </ActionDialog>
    </>
  );
}

type RowUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean | null;
};

type DialogKind = "role" | "password" | "ban" | "unban" | "delete";

export function UserActions({ user, isSelf }: { user: RowUser; isSelf: boolean }) {
  const [dialog, setDialog] = useState<DialogKind | null>(null);
  const isAdmin = user.role === "admin";

  function dialogProps(kind: DialogKind) {
    return {
      open: dialog === kind,
      onOpenChange: (open: boolean) => setDialog(open ? kind : null),
    };
  }

  return (
    <>
      {/* Non-modal so the dialogs opened from it can take focus cleanly. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`${user.name} için işlemler`}>
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem disabled={isSelf} onSelect={() => setDialog("role")}>
            {isAdmin ? "Üye yap" : "Yönetici yap"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog("password")}>Şifre belirle</DropdownMenuItem>
          {user.banned ? (
            <DropdownMenuItem onSelect={() => setDialog("unban")}>Askıyı kaldır</DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled={isSelf} onSelect={() => setDialog("ban")}>
              Askıya al
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSelf}
            onSelect={() => setDialog("delete")}
          >
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog
        {...dialogProps("role")}
        title={isAdmin ? "Yönetici yetkisini kaldır" : "Yönetici yap"}
        description={
          isAdmin
            ? `${user.name} artık yönetim paneline erişemeyecek.`
            : `${user.name} yönetim paneline tam erişim kazanacak: üyeleri ve duyuruları yönetebilecek.`
        }
        submitLabel={isAdmin ? "Üye yap" : "Yönetici yap"}
        onSubmit={() => setUserRole(user.id, isAdmin ? "user" : "admin")}
      />

      <ActionDialog
        {...dialogProps("password")}
        title="Şifre belirle"
        description={`${user.email} için yeni bir şifre belirle.`}
        submitLabel="Kaydet"
        onSubmit={(formData) => setUserPassword(user.id, formData.get("password") as string)}
      >
        <div className="space-y-2">
          <Label htmlFor={`password-${user.id}`}>Yeni şifre</Label>
          <Input
            id={`password-${user.id}`}
            name="password"
            type="password"
            minLength={6}
            required
            autoComplete="new-password"
            placeholder="En az 6 karakter"
            className="h-11"
          />
        </div>
      </ActionDialog>

      <ActionDialog
        {...dialogProps("ban")}
        title="Hesabı askıya al"
        description={`${user.name} oturumu kapatılacak ve tekrar giriş yapamayacak.`}
        submitLabel="Askıya al"
        destructive
        onSubmit={(formData) => banUser(user.id, formData.get("reason") as string)}
      >
        <div className="space-y-2">
          <Label htmlFor={`reason-${user.id}`}>Sebep (isteğe bağlı)</Label>
          <Textarea id={`reason-${user.id}`} name="reason" rows={3} />
        </div>
      </ActionDialog>

      <ActionDialog
        {...dialogProps("unban")}
        title="Askıyı kaldır"
        description={`${user.name} tekrar giriş yapabilecek.`}
        submitLabel="Askıyı kaldır"
        onSubmit={() => unbanUser(user.id)}
      />

      <ActionDialog
        {...dialogProps("delete")}
        title="Üyeyi sil"
        description={`${user.name} (${user.email}) kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        submitLabel="Sil"
        destructive
        onSubmit={() => removeUser(user.id)}
      />
    </>
  );
}
