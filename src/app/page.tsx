import { Products } from "@/components/custom/products";
import { HomeCarousel } from "@/components/section/home-carousel";

export default function Home() {
  return (
    <div className="w-full">
      <HomeCarousel />
      <Products />
    </div>
  );
}
