"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  order_id: string;
  total: number;
  status: string;
  created_at: string;
  OrderItem: Array<{
    quantity: number;
    unit_price: number;
    product: {
      name: string;
    };
  }>;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchOrderBySessionId(sessionId);
    }
  }, [sessionId]);

  const fetchOrderBySessionId = async (sessionId: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <h1 className="text-3xl text-center font-medium mb-6">Erro</h1>
        <p className="text-lg text-center mb-4">
          Não foi possível encontrar a sessão de checkout.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar para a Loja
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-3xl text-center font-medium mb-6">
        Compra Realizada com Sucesso!
      </h1>

      <a
        href="/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
      >
        Continuar Comprando
      </a>
    </div>
  );
}
