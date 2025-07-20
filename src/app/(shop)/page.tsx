"use client";

import { Products } from "@/components/custom/products";
import { HomeCarousel } from "@/components/section/home-carousel";
import { ProductFilter } from "./filter";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <HomeCarousel />
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 px-12">
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilter />
          </aside>
          <main className="flex-1 min-w-0">
            <Products />
          </main>
        </div>
      </div>
    </div>
  );
}
