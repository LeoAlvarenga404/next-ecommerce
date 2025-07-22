import { serverBannerService } from "@/services/server-banner";
import { BannerCarousel } from "@/components/custom/banner-carousel";

export async function HomeCarousel() {
  const banners = await serverBannerService.getBanners("HOME");

  return <BannerCarousel banners={banners} />;
}
