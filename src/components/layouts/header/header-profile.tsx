import { LogOutIcon, User } from "lucide-react";
import Link from "next/link";

interface HeaderProfileProps {
  user: any;
  onLogout: () => void;
  isLoading?: boolean;
}

export function HeaderProfile({
  user,
  onLogout,
  isLoading = false,
}: HeaderProfileProps) {
  
  function handleNavigateToProfile() {
    if (user) {
      window.location.href = "/profile";
    }
  }

  return (
    <div className="flex items-center gap-3 pl-2 border-l border-border cursor-pointer">
      <div
        className={`flex items-center justify-center size-8 rounded-full border transition-colors`}
        onClick={handleNavigateToProfile}
      >
        <User
          className={`size-4 ${
            user ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </div>

      <div className="hidden md:flex flex-col">
        <div
          className="text-sm font-medium text-foreground"
          onClick={handleNavigateToProfile}
        >
          Conta
        </div>

        {user ? (
          <div className="text-xs text-muted-foreground">
            {user.email.slice(0, 15) + (user.email.length > 15 ? "..." : "")}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Entrar / Registrar
          </Link>
        )}
      </div>


    </div>
  );
}
