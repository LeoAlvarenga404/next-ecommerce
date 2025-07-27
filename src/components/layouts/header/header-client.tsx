"use client";

import { SearchProducts } from "../../custom/search-products";
import {
  LayoutDashboard,
  ListOrdered,
  ShoppingBag,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeaderProfile } from "./header-profile";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartControl } from "@/components/custom/cart-control";

interface HeaderClientProps {
  initialSession: any;
}

export function HeaderClient({ initialSession }: HeaderClientProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const currentUser = user || initialSession?.session;
  
  useEffect(() => {
    const initialIsAuthenticated = !!initialSession?.session;
    if (initialIsAuthenticated !== isAuthenticated && user !== undefined) {
      router.refresh();
    }
  }, [isAuthenticated, user, initialSession, router, currentUser]);



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
            {currentUser && currentUser.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <LayoutDashboard className="size-5" />
              </Link>
            )}
            {currentUser && (
              <Link
                href="/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <ListOrdered className="size-5" />
              </Link>
            )} 

            <CartControl/>

            <HeaderProfile 
              user={currentUser} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}