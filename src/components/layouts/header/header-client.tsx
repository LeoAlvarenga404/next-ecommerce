"use client";

import { SearchProducts } from "../../custom/search-products";
import {
  LogOutIcon,
  LayoutDashboard,
  ListOrdered,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeaderClient({ session }: { session: any }) {
  const isAuthenticated = !!session;

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-98">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-start px-2 py-4">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-1 gap-4 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.svg"} alt="Logo" width={100} height={50} />
            </Link>
            <SearchProducts />
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="size-5" />
              </div>
              <span>Cart</span>
            </Link>

            {isAuthenticated && (
              <Link
                href="/orders"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ListOrdered className="size-5" />
                <span>Orders</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div
                onClick={() => "logout"}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <LogOutIcon className="size-5" />
                <span>Logout</span>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="size-5" />
                <span>Sign In</span>
              </Link>
            )}
            {session?.role === "ADMIN" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <LayoutDashboard className="size-5" />
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
