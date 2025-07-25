"use client";

import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { IProduct } from "@/@types/product";

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export function AddToCart({
  product,
  quantity = 1,
  variant = "icon",
}: {
  product: IProduct;
  quantity?: number;
  variant?: "icon" | "button";
}) {
  const { addItem, isAddingItem } = useCart();

  const handleAddItemToCart = () => {
    addItem(
      { product, quantity },
      {
        onSuccess: () => {
          toast.success("Produto adicionado ao carrinho com sucesso!");
        },
        onError: (error) => {
          toast.error(
            "Erro ao adicionar produto ao carrinho. Tente novamente."
          );
          console.error("Erro ao adicionar item ao carrinho:", error);
        },
      }
    );
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleAddItemToCart}
        disabled={isAddingItem}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAddingItem ? (
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
      disabled={isAddingItem}
      className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Adicionar ao carrinho"
    >
      {isAddingItem ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
      )}
    </button>
  );
}
