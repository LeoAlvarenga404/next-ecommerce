"use client";

import { useProduct } from "@/hooks/use-products";
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

  return (
    <div>
      <p>{product.product_id}</p>
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p>Categoria: {product.Category.name}</p>
      <div className="flex">
        {product.ProductImage.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={product.name}
            className="w-fit h-64 object-cover mb-4"
          />
        ))}
      </div>
      <h2 className="text-3xl">R${product.price}</h2>
    </div>
  );
}
