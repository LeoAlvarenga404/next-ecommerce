import { useQuery } from "@tanstack/react-query";

interface Product {
  product_id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  sku: string;
  ProductImage: Array<{
    url: string;
    alt_text?: string;
  }>;
  Category: {
    name: string;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface SingleProductResponse {
  product_id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  sku: string;
  ProductImage: Array<{
    url: string;
    alt_text?: string;
  }>;
  Category: {
    name: string;
  };
}

const fetchProducts = async (): Promise<ProductsResponse> => {
  const res = await fetch("/api/products");

  if (!res.ok) {
    throw new Error("Falha ao buscar produtos");
  }

  return res.json();
};

const fetchProduct = async (
  productId: string
): Promise<SingleProductResponse> => {
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
