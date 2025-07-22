import { IProductCategory } from "@/@types/product";
export const categoryService = {
  async getCategories(): Promise<IProductCategory[]> {
    try {
      const res = await fetch("/api/categories");

      if (!res.ok) {
        throw new Error("Falha ao buscar categorias");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async getCategoryByProduct(
    productId: string
  ): Promise<IProductCategory | null> {
    try {
      const res = await fetch(`/api/products/categories/${productId}`);

      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error("Falha ao buscar categoria do produto");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async createCategory(name: string): Promise<IProductCategory> {
    try {
      const res = await fetch("/api/products/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar categoria");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
