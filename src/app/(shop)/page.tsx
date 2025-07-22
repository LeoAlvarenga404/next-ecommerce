
import { FeaturedCategory } from "@/components/section/featured-category";
import { GenericBanner } from "@/components/section/generic-banner";
import { HomeCarousel } from "@/components/section/home-carousel";
import { FeaturedProductCarousel } from "@/components/section/products";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8">
      <HomeCarousel />
      <FeaturedCategory />
      <FeaturedProductCarousel />
      <GenericBanner />
    </div>
  );
}
