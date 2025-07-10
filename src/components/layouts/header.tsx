"use client";

import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          E-NEXT
        </h1>

        <div className="relative w-1/2 max-w-md">
          <Label
            htmlFor="search"
            className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
          >
            <Search size={16} className="text-muted-foreground" />
          </Label>
          <Input id="search" placeholder="Search..." className="pl-9" />
        </div>

        <div className="flex gap-4 items-center">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="size-5" />
            <Link href="/login">Sign In</Link>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="size-5" />
            </div>
            <Link href="/cart">Cart</Link>
          </a>
        </div>
      </div>
    </header>
  );
}
