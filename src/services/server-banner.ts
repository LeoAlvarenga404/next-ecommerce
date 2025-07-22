import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getBannersFromDB = cache(async () => {
  return prisma.banners.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image_url: true,
      url_link: true,
    },
  });
});

export const serverBannerService = {
  async getBanners() {
    try {
      return await getBannersFromDB();
    } catch (error) {
      console.error("Error fetching banners from database:", error);
      return [];
    }
  },
};
