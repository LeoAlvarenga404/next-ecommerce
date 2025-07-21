import { useState, useCallback, useEffect } from "react";
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
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    if (filters.search) {
      const handler = setTimeout(() => {
        setDebouncedFilters(filters);
      }, 100);
      return () => {
        clearTimeout(handler);
      };
    }
  }, [filters]);

  const buildQueryString = (debouncedFilters: ProductFilters) => {
    const params = new URLSearchParams();

    if (debouncedFilters.category)
      params.append("category", debouncedFilters.category);
    if (debouncedFilters.minPrice !== undefined)
      params.append("minPrice", debouncedFilters.minPrice.toString());
    if (debouncedFilters.maxPrice !== undefined)
      params.append("maxPrice", debouncedFilters.maxPrice.toString());
    if (debouncedFilters.search)
      params.append(
        "search",
        debouncedFilters.search
          .split(" ")
          .map((word) => `%${word}%`)
          .join("")
      );
    if (debouncedFilters.brand) params.append("brand", debouncedFilters.brand);
    if (debouncedFilters.inStock !== undefined)
      params.append("inStock", debouncedFilters.inStock.toString());
    if (debouncedFilters.sortBy)
      params.append("sortBy", debouncedFilters.sortBy);
    if (debouncedFilters.sortOrder)
      params.append("sortOrder", debouncedFilters.sortOrder);

    return params.toString();
  };

  return useQuery({
    queryKey: ["products", "filtered", debouncedFilters],
    queryFn: async () => {
      const queryString = buildQueryString(debouncedFilters);
      const url = `/api/products${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao buscar produtos");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Object.keys(debouncedFilters).length > 0,
  });
}
