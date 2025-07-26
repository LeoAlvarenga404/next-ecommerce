"use client";

import { Products } from "@/components/custom/products";
import { ProductFilter } from "./filter";
import { useEffect } from "react";
import { useProductFilter } from "@/hooks/use-product-filter";

export default function AllProductsPage() {
  const { clearFilters } = useProductFilter();

  useEffect(() => {
    clearFilters();
  }, [clearFilters]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-1 sm:px-2 lg:px-2 py-8">
      <div className="flex flex-col lg:flex-row gap-8 px-0">
        <div className="w-full lg:hidden mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Todos os Produtos
          </h1>
        </div>

        <aside className="lg:w-80 flex-shrink-0">
          <ProductFilter filter="all" />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="hidden lg:block mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Todos os Produtos
            </h1>
          </div>
          <Products />
        </main>
      </div>
    </div>
  );
}
