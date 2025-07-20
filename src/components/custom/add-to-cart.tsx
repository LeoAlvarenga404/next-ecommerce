"use client";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/auth-context";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";

export function AddToCart({
  productId,
  quantity = 1,
  variant = "icon",
}: {
  productId: string;
  quantity?: number;
  variant?: "icon" | "button";
}) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItemToCart = async () => {
    setIsAdding(true);

    try {
      if (user) {
        addItem({ productId, quantity });
      }

      const cart = localStorage.getItem("cart");

      if (cart) {
        const parsedCart = Array.isArray(JSON.parse(cart))
          ? JSON.parse(cart)
          : [];
        const existingItem = parsedCart.find(
          (item: { product_id: string }) => item.product_id === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          parsedCart.push({ product_id: productId, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(parsedCart));
      } else {
        localStorage.setItem(
          "cart",
          JSON.stringify([{ product_id: productId, quantity }])
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsAdding(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleAddItemToCart}
        disabled={isAdding}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Adicionando...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddItemToCart}
      disabled={isAdding}
      className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Adicionar ao carrinho"
    >
      {isAdding ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
      )}
    </button>
  );
}
