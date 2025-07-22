import { LogOutIcon, User } from "lucide-react";
import Link from "next/link";

interface HeaderProfileProps {
  user: any;
  onLogout: () => void;
}

export function HeaderProfile({ user, onLogout }: HeaderProfileProps) {
  return (
    <div className="flex items-center gap-3 pl-2 border-l border-border">
      <div
        className={`flex items-center justify-center size-8 rounded-full border transition-colors`}
      >
        <User
          className={`size-4 ${
            user ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </div>

      <div className="hidden md:flex flex-col">
        <div className="text-sm font-medium text-foreground">Conta</div>

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

      <div className="flex items-center">
        {user ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-all duration-200 cursor-pointer"
            title="Sair"
          >
            <LogOutIcon className="size-4" />
            <span className="hidden sm:inline">Sair</span>
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
    </div>
  );
}
