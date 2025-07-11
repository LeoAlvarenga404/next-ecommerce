"use client";

import { useProduct } from "@/hooks/products";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();

  const { data: product, isLoading, error } = useProduct(id as string);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        Erro ao carregar o produto. Tente novamente.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-8 text-red-600">
        Produto não encontrado.
      </div>
    );
  }

  return <div>{product.name}</div>;
}
