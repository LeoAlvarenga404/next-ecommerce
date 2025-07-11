//nextjs - succes/page.tsx
// http://localhost:3000/success?session_id=cs_test_b1n7AHWSaN94SHC8sPeEvoW0J9PE8H3Tpo9GD03s2Z7uN4USFqK29Kel66
"use client";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

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
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-3xl text-center font-medium mb-6">
        Compra Realizada com Sucesso!
      </h1>
      <p className="text-lg text-center mb-4">
        Obrigado por sua compra. Seu pedido está sendo processado.
      </p>
      <p className="text-lg text-center mb-4">
        ID da Sessão: <strong>{sessionId}</strong>
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
