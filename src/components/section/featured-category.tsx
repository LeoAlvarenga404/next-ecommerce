import { CategoryCarousel } from "../custom/category-carousel";
import { IProductCategory } from "@/@types/product";
import { cache } from "react";

const getCategories = cache(async (): Promise<IProductCategory[]> => {
  try {
    const { serverCategoryService } = await import(
      "@/services/server-category"
    );
    const categories = await serverCategoryService.getCategories();

    return categories.map((cat) => ({
      category_id: cat.category_id,
      name: cat.name,
      image: cat.image || undefined,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
});

export async function FeaturedCategory() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Busque por Categoria
          </h2>
        </div>

        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
}
