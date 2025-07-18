import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  brand?: string;
  inStock?: boolean;
  sortBy?: "name" | "price" | "newest";
  sortOrder?: "asc" | "desc";
}

export interface UseProductFilterReturn {
  filters: ProductFilters;
  setFilter: (key: keyof ProductFilters, value: any) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof ProductFilters) => void;
  hasActiveFilters: boolean;
}

let globalFilters: ProductFilters = {};
const listeners: Set<() => void> = new Set();

const updateGlobalFilters = (newFilters: ProductFilters) => {
  globalFilters = newFilters;
  listeners.forEach((listener) => listener());
};

export function useProductFilter(): UseProductFilterReturn {
  const [, forceUpdate] = useState({});

  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);

  useState(() => {
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  });

  const setFilter = useCallback((key: keyof ProductFilters, value: any) => {
    const newFilters = {
      ...globalFilters,
      [key]: value === "" || value === undefined ? undefined : value,
    };

    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key as keyof ProductFilters] === undefined) {
        delete newFilters[key as keyof ProductFilters];
      }
    });

    updateGlobalFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    updateGlobalFilters({});
  }, []);

  const clearFilter = useCallback((key: keyof ProductFilters) => {
    const newFilters = { ...globalFilters };
    delete newFilters[key];
    updateGlobalFilters(newFilters);
  }, []);

  const hasActiveFilters = Object.keys(globalFilters).length > 0;

  return {
    filters: globalFilters,
    setFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
  };
}

export function useFilteredProducts(filters: ProductFilters) {
  const buildQueryString = (filters: ProductFilters) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.inStock !== undefined)
      params.append("inStock", filters.inStock.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return params.toString();
  };

  return useQuery({
    queryKey: ["products", "filtered", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const url = `/api/products${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao buscar produtos");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Object.keys(filters).length > 0
  });
}
