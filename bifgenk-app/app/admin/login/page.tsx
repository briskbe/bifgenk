import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminLoginForm } from "./login-form";

export const metadata = { title: "Yönetici Girişi · BIF Genk" };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.user.role === "admin") redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/40">
      <div className="w-full max-w-[400px] space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
              B
            </div>
            <span className="text-lg font-bold">BIF Genk</span>
            <span className="ml-auto rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background">
              Yönetim
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Yönetici girişi</h1>
            <p className="text-muted-foreground text-sm">
              Yönetim paneline erişmek için yönetici hesabınla giriş yap.
            </p>
          </div>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
