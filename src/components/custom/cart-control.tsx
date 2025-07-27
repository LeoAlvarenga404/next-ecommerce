import { useCart } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function CartControl() {
  const {
    getTotalQuantity,
    isLoadingCart,
    syncLocalCartToServer,
  } = useCart();

  useEffect(() => {
    syncLocalCartToServer();
  }, [syncLocalCartToServer]);

  const quantity = Number(getTotalQuantity());

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
    >
      <div className="relative">
        <ShoppingBag className="size-5" />
        {!isLoadingCart && quantity > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-destructive text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
            <span className="text-[10px]">{quantity > 99 ? 99 : quantity}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
