"use client";

import { Products } from "@/components/custom/products";
import { HomeCarousel } from "@/components/section/home-carousel";
import { ProductFilter } from "./filter";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <HomeCarousel />

    </div>
  );
}
