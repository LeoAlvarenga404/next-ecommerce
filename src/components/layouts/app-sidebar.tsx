"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LayoutDashboard,
  ChevronRight,
  Circle,
  LucideIcon,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { NavUser } from "./nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface ISidebarItem {
  title: string;
  icon: LucideIcon;
  url?: string;
  subMenu?: ISidebarItem[];
}

const sidebarItems: ISidebarItem[] = [
  {
    title: "Visão Geral",
    icon: BarChart3,
    url: "/admin",
  },
  {
    title: "Catálogo",
    icon: Package,
    subMenu: [
      { title: "Produtos", url: "/admin/catalog/products", icon: Circle },
      { title: "Categorias", url: "/admin/catalog/categories", icon: Circle },
      { title: "Atributos", url: "/admin/catalog/attributes", icon: Circle },
    ],
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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
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
            const isActive = item.url && pathname.startsWith(item.url);
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;
            const isSubMenuActive =
              hasSubMenu &&
              item.subMenu?.some(
                (subItem) => subItem.url && pathname.startsWith(subItem.url)
              );

            if (hasSubMenu) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isSubMenuActive}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={isActive || isSubMenuActive}>
                        {item.icon && <item.icon size={16} />}
                        {item.title}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subMenu?.map((subItem) => {
                          const isSubActive =
                            subItem.url && pathname.endsWith(subItem.url);

                          return (
                            <SidebarMenuSubItem
                              key={subItem.url || subItem.title}
                            >
                              <SidebarMenuSubButton
                                asChild
                                isActive={!!isSubActive}
                              >
                                <a
                                  href={subItem.url}
                                  className="flex items-center gap-2"
                                >
                                  {subItem.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.url || item.title}>
                <SidebarMenuButton asChild isActive={!!isActive}>
                  <a href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon size={12} />}
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
