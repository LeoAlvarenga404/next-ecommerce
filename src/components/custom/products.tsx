"use client";

import { useProducts } from "@/hooks/products";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCart } from "./add-to-cart";

export function Products() {
  const { data, isLoading, error } = useProducts();

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
        Erro ao carregar produtos. Tente novamente.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 max-w-6xl mx-auto">
      {data?.products.map((product) => (
        <Card key={product.product_id} className="p-4">
          <b className="text-gray-600">{product.name}</b>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-700">Preço: R$ {product.price.toFixed(2)}</p>
          <div className="flex justify-between items-center mt-4">
            <Link href={`/product/${product.product_id}`}>
              <Button>Ver Produto</Button>
            </Link>
            <AddToCart productId={product.product_id} quantity={1} />
          </div>
        </Card>
      ))}
    </div>
  );
}
