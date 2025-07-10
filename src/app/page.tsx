import { Products } from "@/components/custom/products";
import { HomeCarousel } from "@/components/section/home-carousel";

// app / page.tsx
// essa página será a página inicial de um ecommerce de tênis

export default function Home() {
  return (
    <div className="w-full">
      <HomeCarousel />
      <Products />
    </div>
  );
}
