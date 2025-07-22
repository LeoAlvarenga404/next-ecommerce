import { serverBannerService } from "@/services/server-banner";
import { BannerCarousel } from "@/components/custom/banner-carousel";

type Banner = {
  id: string;
  title: string | null;
  description?: string | null;
  image_url: string | null;
  url_link?: string | null;
};

export async function HomeCarousel() {
  const banners = await serverBannerService.getBanners();

  const fallbackBanners = [
    {
      id: "1",
      title: "Banner 1",
      description: null,
      image_url: "/banner-2.webp",
      url_link: null,
    },
    {
      id: "2",
      title: "Banner 2",
      description: null,
      image_url: "/banner-2.webp",
      url_link: null,
    },
    {
      id: "3",
      title: "Banner 3",
      description: null,
      image_url: "/banner-2.webp",
      url_link: null,
    },
  ];

  const carouselData = banners.length > 0 ? banners : fallbackBanners;

  return <BannerCarousel banners={carouselData} />;
}
