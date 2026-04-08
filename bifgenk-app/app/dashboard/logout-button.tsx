"use client";

import { logout } from "../(auth)/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => logout()}
      className="text-sm"
    >
      Çıkış yap
    </Button>
  );
}
