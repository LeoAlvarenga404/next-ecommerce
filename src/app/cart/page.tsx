"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();
  return (
    <div className="flex gap-4 w-full p-4">
      <div className="w-full">
        {cart?.CartItem.map((item: any) => (
          <Card key={item.cart_item_id} className="border p-2">
            <h3>{item.product.name}</h3>
            <p>Price: ${item.product.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
          </Card>
        ))}
      </div>
      <Card className="w-full">
        <h2 className="text-xl font-semibold mb-4">Total: ${cart?.total}</h2>
        <Link href={"/checkout"}>
          <Button>Ir para o checkout</Button>
        </Link>
      </Card>
    </div>
  );
}
