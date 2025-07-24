import type { IProduct } from "@/@types/product";

export const clientProductService = {
  async getProducts(): Promise<IProduct[]> {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Falha ao buscar produtos");
      }

      return res.json() ?? [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async getProductById(productId: string): Promise<IProduct> {
    try {
      const res = await fetch(`/api/products/${productId}`);

      if (!res.ok) {
        throw new Error("Falha ao buscar produto");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async createProduct(
    product: Omit<IProduct, "product_id">
  ): Promise<IProduct> {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar produto");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
