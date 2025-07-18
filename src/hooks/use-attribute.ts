import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attributeService } from "@/services/attribute";
import {
  IProductAttributeValue,
  type IProductAttribute,
} from "@/@types/product";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function useAttributes() {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: attributeService.getAttributes,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useAttributeByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["attributes", categoryId],
    queryFn: () => attributeService.getAttributeByCategory(categoryId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId,
  });
}

export function useCreateAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<IProductAttribute, "attribute_id">) =>
      attributeService.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
}

export function useCreateProductAttributeValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: {
        product_id: string;
        value: string;
        attribute_id: string;
      }
    ) => attributeService.createProductAttributeValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
}

export function useAssociateCategoryAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      attributesId,
    }: {
      categoryId: string;
      attributesId: string[];
    }) => attributeService.associateCategoryAttribute(categoryId, attributesId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attributes", "category", variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
}
