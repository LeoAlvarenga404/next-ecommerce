"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleCheckout = async () => {
    setLoading(true);

    if (!isAuthenticated) {
      alert("Precisa ta logado");
      setLoading(false);

      return;
    }
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
        );
        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
        }
      } else {
        console.error("Erro no checkout:", data.error);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <Card className="p-8">
        <h1 className="text-3xl text-center font-medium mb-6">Checkout</h1>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processando..." : "Finalizar Compra"}
        </button>
      </Card>
    </div>
  );
}
