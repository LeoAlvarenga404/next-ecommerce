import { prisma } from "@/lib/prisma";
import { cache } from "react";

const getCategoriesFromDB = cache(async () => {
  return prisma.category.findMany({
    select: {
      category_id: true,
      name: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });
});

export const serverCategoryService = {
  async getCategories() {
    try {
      return await getCategoriesFromDB();
    } catch (error) {
      console.error("Error fetching categories from database:", error);
      return [];
    }
  },

  async getCategory(categoryId: string) {
    try {
      return await prisma.category.findUnique({
        where: { category_id: categoryId },
        select: {
          category_id: true,
          name: true,
          image: true,
        },
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  },
};
