import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { adminLogout } from "../actions";
import { AdminNav } from "./admin-nav";

export const metadata = { title: "Yönetim Paneli · BIF Genk" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
              B
            </div>
            <span className="font-bold text-lg">BIF Genk</span>
            <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background">
              Yönetim
            </span>
          </Link>

          <AdminNav />

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-sm text-muted-foreground">{user.email}</span>
            <form action={adminLogout}>
              <Button type="submit" variant="outline" size="sm" className="text-sm">
                Çıkış yap
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
