"use client";

import { HomeCarousel } from "@/components/section/home-carousel";
import { FeaturedProductCarousel } from "@/components/section/products";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <HomeCarousel />
      <FeaturedProductCarousel />
    </div>
  );
}
