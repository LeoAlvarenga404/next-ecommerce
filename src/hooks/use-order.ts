import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getOrders,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
