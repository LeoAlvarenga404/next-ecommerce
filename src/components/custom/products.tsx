"use client";

import { useProducts } from "@/hooks/use-products";
import {
  useProductFilter,
  useFilteredProducts,
} from "@/hooks/use-product-filter";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCart } from "./add-to-cart";
import { ProductImage } from "./image";
import { AddToWishlist } from "./add-to-wishlist";
import { IProduct } from "@/@types/product";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { Badge } from "../ui/badge";

export function Products() {
  const { filters } = useProductFilter();

  const hasFilters = Object.keys(filters).length > 0;
  const {
    data: allProducts,
    isLoading: allLoading,
    error: allError,
  } = useProducts();

  const {
    data: filteredData,
    isLoading: filteredLoading,
    error: filteredError,
  } = useFilteredProducts(filters);

  const data = hasFilters ? filteredData : allProducts;
  const isLoading = hasFilters ? filteredLoading : allLoading;
  const error = hasFilters ? filteredError : allError;

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

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        {hasFilters
          ? "Nenhum produto encontrado com os filtros aplicados."
          : "Nenhum produto disponível."}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hasFilters ? "Produtos Filtrados" : "Todos os Produtos"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {products.length} produto{products.length !== 1 ? "s" : ""}
            {hasFilters ? " encontrado" : " disponível"}
            {products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {hasFilters && (
          <div className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
            <span className="font-medium">Filtros aplicados</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: IProduct) => {
          const valueWithDiscount =
            product.price - (product.price * (product.discount || 0)) / 100;

          return (
            <Card
              key={product.product_id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white rounded-xl overflow-hidden p-0"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <ProductImage
                  src={product?.ProductImage[0]?.url}
                  alt={product.name}
                />
                <div className="absolute top-3 right-3 z-10">
                  <AddToWishlist productId={product.product_id} />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2rem]">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.Category?.name || "Categoria"}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <div className="flex flex-col w-full">
                      {(product.discount || 0) > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPriceToBrazilianCurrency(product.price)}
                          </span>
                          <Badge className="bg-red-500">
                            %{product.discount}
                          </Badge>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 w-full">
                          {formatPriceToBrazilianCurrency(valueWithDiscount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/product/${product.product_id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-sm h-9 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Ver Detalhes
                    </Button>
                  </Link>

                  <div className="flex items-center">
                    <AddToCart
                      productId={product.product_id}
                      quantity={1}
                      variant="icon"
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasFilters
              ? "Nenhum produto encontrado"
              : "Nenhum produto disponível"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {hasFilters
              ? "Tente ajustar seus filtros para encontrar mais produtos."
              : "Novos produtos serão adicionados em breve."}
          </p>
        </div>
      )}
    </div>
  );
}
