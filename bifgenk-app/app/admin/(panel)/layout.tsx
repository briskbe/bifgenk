import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/session";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminBreadcrumb, AdminSidebar } from "./admin-sidebar";

export const metadata = { title: "Yönetim Paneli · BIF Genk" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar user={{ name: user.name, email: user.email }} />
        <SidebarInset className="bg-muted/40">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4!" />
            <AdminBreadcrumb />
          </header>
          <div className="flex-1 px-4 py-8 md:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
