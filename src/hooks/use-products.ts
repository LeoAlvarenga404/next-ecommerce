import { useQuery } from "@tanstack/react-query";

export interface IProductProductImage {
  url: string;
  alt_text?: string;
}

export interface IProductCategory {
  category_id: string;
  name: string;
}
export interface IProductAttribute {
  attribute_id: string;
  name: string;
  unit?: string;
  type: string;
}
export interface IProductAttributeValue {
  attribute_id: string;
  value: string;
  attribute: IProductAttribute;
}
export interface IProduct {
  product_id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  sku: string;
  Category: IProductCategory;
  ProductImage: IProductProductImage[];
  ProductAttributeValue: IProductAttributeValue[];
}

export interface ProductsResponse {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const fetchProducts = async (): Promise<ProductsResponse> => {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("Falha ao buscar produtos");
  }

  return res.json();
};

const fetchProduct = async (productId: string): Promise<IProduct> => {
  const res = await fetch(`/api/products/${productId}`);

  if (!res.ok) {
    throw new Error("Falha ao buscar produto");
  }

  return res.json();
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId,
  });
}
