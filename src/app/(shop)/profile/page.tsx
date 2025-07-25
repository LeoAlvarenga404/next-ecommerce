"use client";

import { useAuth } from "@/hooks/use-auth";
import { Link, LogOutIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, isLogoutPending } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <div className="flex items-center">
      {user ? (
        <button
          onClick={handleLogout}
          disabled={isLogoutPending}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Sair"
        >
          <LogOutIcon className="size-4" />
          <span className="hidden sm:inline">
            {isLogoutPending ? "Saindo..." : "Sair"}
          </span>
        </button>
      ) : (
        <div className="md:hidden">
          <Link
            href="/login"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium px-2 py-1 rounded-md hover:bg-primary/10"
          >
            Entrar
          </Link>
        </div>
      )}
    </div>
  );
}
