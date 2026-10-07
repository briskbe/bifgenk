import Link from "next/link";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateUserButton, UserActions } from "./user-dialogs";

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { user: me } = await requireAdmin();
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const where = query
    ? or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`))
    : undefined;

  const [users, [{ total }], [{ admins }], [{ banned }], [{ matching }]] = await Promise.all([
    db
      .select()
      .from(user)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(user),
    db.select({ admins: count() }).from(user).where(eq(user.role, "admin")),
    db.select({ banned: count() }).from(user).where(eq(user.banned, true)),
    db.select({ matching: count() }).from(user).where(where),
  ]);

  const pageCount = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/users?${qs}` : "/admin/users";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Üyeler</h1>
          <p className="text-sm text-muted-foreground">
            Tüm hesapları görüntüle, rollerini değiştir, askıya al veya sil.
          </p>
        </div>
        <CreateUserButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Toplam üye" value={total} />
        <Stat label="Yönetici" value={admins} />
        <Stat label="Askıda" value={banned} />
      </div>

      <div className="rounded-xl border bg-card">
        <form className="flex gap-2 border-b p-4" action="/admin/users">
          <Input
            name="q"
            defaultValue={query}
            placeholder="İsim veya e-posta ara"
            className="h-10 max-w-sm"
          />
          <Button type="submit" variant="outline">
            Ara
          </Button>
          {query && (
            <Button asChild variant="ghost">
              <Link href="/admin/users">Temizle</Link>
            </Button>
          )}
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Üye</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Katılma tarihi</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  {query ? "Aramanla eşleşen üye yok." : "Henüz üye yok."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-4">
                    <div className="font-medium">
                      {u.name}
                      {u.id === me.id && (
                        <span className="ml-2 text-xs text-muted-foreground">(sen)</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    {u.role === "admin" ? (
                      <Badge>Yönetici</Badge>
                    ) : (
                      <Badge variant="secondary">Üye</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.banned ? (
                      <Badge variant="destructive" title={u.banReason ?? undefined}>
                        Askıda
                      </Badge>
                    ) : (
                      <Badge variant="outline">Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.createdAt.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <UserActions user={u} isSelf={u.id === me.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
            <span>
              Sayfa {page} / {pageCount}
            </span>
            <div className="flex gap-2">
              <PageLink href={page > 1 ? pageHref(page - 1) : null}>Önceki</PageLink>
              <PageLink href={page < pageCount ? pageHref(page + 1) : null}>Sonraki</PageLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function PageLink({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) {
    return (
      <Button variant="outline" size="sm" disabled>
        {children}
      </Button>
    );
  }
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href}>{children}</Link>
    </Button>
  );
}
