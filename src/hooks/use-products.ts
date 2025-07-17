import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IProduct, IProductsResponse } from "@/@types/product";
import { productService } from "@/services/product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId,
  });
}

export function useCreateProduct(data: Omit<IProduct, "product_id">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
