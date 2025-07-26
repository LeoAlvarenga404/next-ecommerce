"use client";

import { useProducts } from "@/hooks/use-products";
import {
  useProductFilter,
  useFilteredProducts,
} from "@/hooks/use-product-filter";
import { ShoppingCart } from "lucide-react";
import { IProduct } from "@/@types/product";
import { ProductCard } from "./product-card";
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



      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: IProduct) => {
          return <ProductCard key={product.product_id} product={product} />;
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
