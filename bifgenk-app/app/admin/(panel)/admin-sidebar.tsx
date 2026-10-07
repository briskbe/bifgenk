"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Calendar03Icon,
  DashboardSquare01Icon,
  Globe02Icon,
  Logout01Icon,
  Megaphone01Icon,
  UnfoldMoreIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { adminLogout } from "../actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { href: string; label: string; icon: IconSvgElement; exact?: boolean };

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Genel bakış", icon: DashboardSquare01Icon, exact: true },
  { href: "/admin/meetings", label: "Toplantılar", icon: Calendar03Icon },
  { href: "/admin/announcements", label: "Duyurular", icon: Megaphone01Icon },
  { href: "/admin/users", label: "Üyeler", icon: UserGroupIcon },
];

const SITE_NAV: NavItem[] = [
  { href: "/", label: "Siteyi görüntüle", icon: Globe02Icon },
  { href: "/dashboard", label: "Üye paneli", icon: UserIcon },
];

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/** Section name for the top bar, derived from the current route. */
export function AdminBreadcrumb() {
  const pathname = usePathname();
  const current = MAIN_NAV.find((item) => isActive(pathname, item));

  return (
    <nav aria-label="Konum" className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Yönetim</span>
      {current && current.href !== "/admin" && (
        <>
          <span className="text-muted-foreground/50">/</span>
          <Link href={current.href} className="font-medium hover:underline">
            {current.label}
          </Link>
        </>
      )}
    </nav>
  );
}

export function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function renderItems(items: NavItem[]) {
    return items.map((item) => (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton asChild isActive={isActive(pathname, item)} tooltip={item.label}>
          <Link href={item.href} onClick={() => setOpenMobile(false)}>
            <HugeiconsIcon icon={item.icon} strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="BIF Genk Yönetim">
              <Link href="/admin">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  B
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <Image
                    src="/logo.png"
                    alt="BIF Genk Gençlik"
                    width={2171}
                    height={354}
                    className="h-5 w-auto"
                    priority
                  />
                  <span className="mt-1 text-[11px] font-medium text-muted-foreground">
                    Yönetim paneli
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(MAIN_NAV)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(SITE_NAV)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 text-xs font-bold text-white">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
                className="w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => adminLogout()}>
                  <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                  Çıkış yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
