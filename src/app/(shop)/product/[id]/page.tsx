"use client";

import { ProductImage } from "@/components/custom/image";
import { useProduct } from "@/hooks/use-products";
import Image from "next/image";
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
    <div className="w-[800px] p-5">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p>Categoria: {product.Category.name}</p>
      <div className="flex gap-4">
        {product.ProductImage.map((image, index) => (
          <div key={index} className="relative w-32 h-32 flex-shrink-0">
            <ProductImage
              src={image.url}
              alt={`${product.name} - ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <h2 className="text-3xl">R${product.price}</h2>
      <p>Atributos: </p>
      <div className="list-disc pl-5 ">
        {product.ProductAttributeValue.map((attr) => (
          <p key={attr.attribute_id}>
            <b>{attr.attribute.name}:</b> {attr.value}
            {attr.attribute.unit && ` (${attr.attribute.unit})`}
          </p>
        ))}
      </div>
    </div>
  );
}
