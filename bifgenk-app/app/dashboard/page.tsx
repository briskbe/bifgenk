import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name || "Üye";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
              B
            </div>
            <span className="font-bold text-lg">BIF Genk</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Welcome */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hoş geldin, {fullName}!</h1>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-5 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Üyelik</p>
              <p className="text-lg font-bold text-primary">Aktif</p>
            </div>
            <div className="rounded-xl border bg-card p-5 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Katıldığın etkinlik</p>
              <p className="text-lg font-bold">0</p>
            </div>
            <div className="rounded-xl border bg-card p-5 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Katılma tarihi</p>
              <p className="text-lg font-bold">
                {new Date(user.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Upcoming */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-bold text-lg">Yaklaşan Etkinlikler</h2>
            <div className="text-sm text-muted-foreground py-8 text-center">
              Henüz yaklaşan etkinlik yok. Yakında yeni etkinlikler eklenecek!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
