import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { announcement } from "@/lib/db/schema";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const { user } = await requireUser();
  const announcements = await db
    .select()
    .from(announcement)
    .orderBy(desc(announcement.createdAt))
    .limit(10);

  const fullName = user.name || "Üye";
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
          <div className="flex items-center gap-2">
            {user.role === "admin" && (
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link href="/admin">Yönetim paneli</Link>
              </Button>
            )}
            <LogoutButton />
          </div>
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
                {user.createdAt.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Announcements */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-bold text-lg">Duyurular</h2>
            {announcements.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                Henüz duyuru yok.
              </div>
            ) : (
              <ul className="divide-y">
                {announcements.map((item) => (
                  <li key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <time
                        dateTime={item.createdAt.toISOString()}
                        className="text-xs text-muted-foreground"
                      >
                        {item.createdAt.toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {item.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
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
