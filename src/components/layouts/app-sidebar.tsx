"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Upload,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "./nav-user";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/admin",
  },
  {
    title: "Products",
    icon: Package,
    url: "/admin/products",
  },
  {
    title: "Categories",
    icon: FolderOpen,
    url: "/admin/categories",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    url: "/admin/orders",
  },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">E-NEXT</span>
                  <span className="">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator orientation="horizontal" className="mr-2 h-4" />

      <SidebarContent className="gap-0">
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const isActive = pathname.endsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon size={16} />
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
