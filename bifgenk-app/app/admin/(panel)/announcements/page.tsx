import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { announcement, user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { AnnouncementActions, NewAnnouncementForm } from "./announcement-forms";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();

  const announcements = await db
    .select({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
      authorName: user.name,
    })
    .from(announcement)
    .leftJoin(user, eq(announcement.authorId, user.id))
    .orderBy(desc(announcement.createdAt));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Duyurular</h1>
        <p className="text-sm text-muted-foreground">
          Burada yayınlanan duyurular tüm üyelerin panelinde görünür.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-bold text-lg">Yeni duyuru</h2>
          <NewAnnouncementForm />
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-bold text-lg">
            Yayınlananlar <span className="text-muted-foreground font-medium">({announcements.length})</span>
          </h2>
          {announcements.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Henüz duyuru yok.</div>
          ) : (
            <ul className="divide-y">
              {announcements.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.createdAt.toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {item.authorName && ` · ${item.authorName}`}
                    </p>
                  </div>
                  <AnnouncementActions announcement={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
