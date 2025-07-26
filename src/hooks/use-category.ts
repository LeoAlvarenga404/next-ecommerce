import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useCategoryByProduct(productId: string) {
  return useQuery({
    queryKey: ["category", productId],
    queryFn: () => categoryService.getCategoryByProduct(productId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  });
}

export function useCategoryByName(name: string) {
  
  return useQuery({
    queryKey: ["category", "name", name],
    queryFn: () => categoryService.getCategoryByName(name),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!name,
  });

}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => categoryService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
