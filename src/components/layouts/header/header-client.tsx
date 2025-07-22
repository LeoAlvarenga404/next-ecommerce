"use client";

import { SearchProducts } from "../../custom/search-products";
import {
  LogOutIcon,
  LayoutDashboard,
  ListOrdered,
  ShoppingCart,
  User,
  ShoppingBag,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderProfile } from "./header-profile";

export function HeaderClient({ session }: { session: any }) {
  const user = session?.session;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      window.location.href = "/";
    });
  };

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-start px-4 py-4">
        <div className="flex items-center justify-between w-full gap-6">
          <div className="flex flex-1 gap-6 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image src={"/logo.svg"} alt="Logo" width={100} height={50} />
            </Link>
            <div className="flex-1">
              <SearchProducts />
            </div>
          </div>

          <div className="flex gap-0 items-center">
            {user && user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <LayoutDashboard className="size-5" />
              </Link>
            )}
            {user && (
              <Link
                href="/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <ListOrdered className="size-5" />
              </Link>
            )}
            <Link
              href="/wishlist"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <div className="relative">
                <Heart className="size-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  1
                </span>
              </div>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <div className="relative">
                <ShoppingBag className="size-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  9
                </span>
              </div>
            </Link>

            <HeaderProfile user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}
