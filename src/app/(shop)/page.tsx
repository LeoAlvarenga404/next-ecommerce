"use client";

import { Products } from "@/components/custom/products";
import { HomeCarousel } from "@/components/section/home-carousel";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-category";
import { ProductFilter } from "./filter";

function CategoryCard({ name }: { name: string }) {
  return (
    <Button variant={"outline"} className="w-fit h-12 uppercase">
      {name}
    </Button>
  );
}

function CategoryList() {
  const { data } = useCategories();
  return (
    <div className="flex gap-4 justify-center mt-5">
      {data?.slice(0, 10).map((category) => (
        <CategoryCard key={category.category_id} name={category.name} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <HomeCarousel />
      <CategoryList />

      {/* Container principal com filtros e produtos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com filtros */}
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter />
          </aside>

          {/* Área principal de produtos */}
          <main className="flex-1 min-w-0">
            <Products />
          </main>
        </div>
      </div>
    </div>
  );
}
