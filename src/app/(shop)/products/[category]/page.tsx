"use client";

import { Products } from "@/components/custom/products";
import { ProductFilter } from "../filter";
import { useParams } from "next/navigation";
import { useCategoryByName } from "@/hooks/use-category";
import { useEffect } from "react";
import { useProductFilter } from "@/hooks/use-product-filter";
import { Loading } from "@/components/custom/loading";

export default function ProductsPage() {
  const { category } = useParams<{ category: string }>();
  const { data: categoryData, isLoading } = useCategoryByName(category);
  const { clearFilters, filters } = useProductFilter();

  useEffect(() => {
    clearFilters();
  }, [category, clearFilters]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-1 sm:px-2 lg:px-2 py-8">
      <div className="flex flex-col lg:flex-row gap-8 px-0">
        {categoryData && (
          <div className="w-full lg:hidden mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Produtos - {categoryData.name}
            </h1>
          </div>
        )}

        <aside className="lg:w-80 flex-shrink-0">
          <ProductFilter
            categoryId={categoryData?.category_id}
            filter={categoryData?.category_id ? "category" : "all"}
          />
        </aside>

        <main className="flex-1 min-w-0">
          {categoryData && (
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Produtos - {categoryData.name}
              </h1>
            </div>
          )}
          <Products />
        </main>
      </div>
    </div>
  );
}
