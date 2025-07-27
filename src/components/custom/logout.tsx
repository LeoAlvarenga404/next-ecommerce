import { useAuth } from "@/hooks/use-auth";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logout() {
  const { isLogoutPending, logout } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
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
  );
}
