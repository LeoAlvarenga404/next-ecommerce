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
    <div className="w-full">
      <HomeCarousel />
      <CategoryList />
      <div className="mt-10 flex max-w-7xl justify-center w-full mx-auto gap-4">
        <ProductFilter />
        <Products />
      </div>
    </div>
  );
}
