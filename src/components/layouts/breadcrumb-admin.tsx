"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbAdmin() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path && path !== "admin");

  if (pathname === "/admin" || pathname === "/admin/") {
    paths.unshift("Visão Geral");
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink className="capitalize">{path}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < paths.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
