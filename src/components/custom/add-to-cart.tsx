"use client";
import { useCart } from "@/hooks/cart";
import { ShoppingCart } from "lucide-react";

export function AddToCart({
  productId,
  quantity = 1,
}: {
  productId: string;
  quantity: number;
}) {
  const { addItem } = useCart();

  const handleAddItemToCart = () => {
    addItem({ productId, quantity });
  };

  return (
    <button onClick={handleAddItemToCart} className="cursor-pointer">
      <ShoppingCart className="text-gray-600" />
    </button>
  );
}
