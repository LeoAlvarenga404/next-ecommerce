import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IProduct } from "@/@types/product";
import { clientProductService } from "@/services/client-product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: clientProductService.getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => clientProductService.getProductById(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId,
  });
}

export function useCreateProduct(data: Omit<IProduct, "product_id">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clientProductService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
