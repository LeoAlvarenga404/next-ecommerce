"use client";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/auth-context";
import { ShoppingCart } from "lucide-react";

export function AddToCart({
  productId,
  quantity = 1,
}: {
  productId: string;
  quantity: number;
}) {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddItemToCart = () => {
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
  };

  return (
    <button onClick={handleAddItemToCart} className="cursor-pointer">
      <ShoppingCart className="text-gray-600" />
    </button>
  );
}
