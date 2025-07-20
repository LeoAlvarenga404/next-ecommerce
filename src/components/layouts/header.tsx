"use client";

import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  User,
  Search,
  ListOrdered,
  LogOut,
  LogOutIcon,
  LayoutDashboard,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
export function Header() {
  const { isAuthenticated, logout, isLoading, user } = useAuth();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="Logo" width={100} height={50} />
        </Link>
        <div className="relative w-1/2 max-w-md">
          <Label
            htmlFor="search"
            className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
          >
            <Search size={16} className="text-muted-foreground" />
          </Label>
          <Input
            id="search"
            placeholder="Busque por pedidos..."
            className="pl-9"
          />
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
              onClick={logout}
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
          {user?.role === "ADMIN" && (
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
    </header>
  );
}
