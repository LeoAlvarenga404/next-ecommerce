import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getBannersFromDB = cache(async (display_on: string) => {
  return prisma.banners.findMany({
    where: {
      display_on: display_on,
    },
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
  async getBanners(display_on: string) {
    try {
      return await getBannersFromDB(display_on);
    } catch (error) {
      console.error("Error fetching banners from database:", error);
      return [];
    }
  },
};
