import { FeaturedCategory } from "@/components/section/featured-category";
import { GenericBanner } from "@/components/section/generic-banner";
import { HomeCarousel } from "@/components/section/home-carousel";
import { FeaturedProducts } from "@/components/section/featured-products";

export default function Home() {

  

  return (
    <div className="w-full min-h-screen flex flex-col gap-12">
      <HomeCarousel />
      <FeaturedCategory />
      <FeaturedProducts />
    </div>
  );
}
