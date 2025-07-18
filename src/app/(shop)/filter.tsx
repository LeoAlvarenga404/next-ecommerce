"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X, Filter } from "lucide-react";
import { useProductFilter } from "@/hooks/use-product-filter";
import { useCategories } from "@/hooks/use-category";

export function ProductFilter() {
  const { filters, setFilter, clearFilters, clearFilter, hasActiveFilters } =
    useProductFilter();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleClearCategory = () => {
    clearFilter("category");
  };

  const handleClearPrice = () => {
    clearFilter("minPrice");
    clearFilter("maxPrice");
  };

  return (
    <Card className="w-80 h-fit sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar tudo
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Categoria</Label>
            {filters.category && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCategory}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Select
            value={filters.category || undefined}
            onValueChange={(value) => setFilter("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Faixa de Preço</Label>
            {(filters.minPrice || filters.maxPrice) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearPrice}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Preço Mínimo</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number(e.target.value)
                    : undefined;
                  setFilter("minPrice", value);
                }}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Preço Máximo</Label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={filters.maxPrice || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number(e.target.value)
                    : undefined;
                  setFilter("maxPrice", value);
                }}
                className="h-8"
              />
            </div>
          </div>

          {(filters.minPrice || filters.maxPrice) && (
            <div className="text-xs text-muted-foreground">
              Faixa: R$ {filters.minPrice || 0} - R$ {filters.maxPrice || "∞"}
            </div>
          )}
        </div>

        <Separator />

        {/* Filtro por Busca */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Buscar</Label>
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("search")}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Input
            placeholder="Buscar produtos..."
            value={filters.search || ""}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>

        <Separator />

        {/* Filtro por Ordenação */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ordenar por</Label>
          <Select
            value={filters.sortBy || undefined}
            onValueChange={(value) => setFilter("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ordenação</SelectLabel>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="newest">Mais recentes</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {filters.sortBy && (
            <Select
              value={filters.sortOrder || "asc"}
              onValueChange={(value) => setFilter("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ordem</SelectLabel>
                  <SelectItem value="asc">Crescente</SelectItem>
                  <SelectItem value="desc">Decrescente</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Mostrar filtros ativos */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtros ativos</Label>
              <div className="flex flex-wrap gap-1">
                {filters.category && (
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Categoria
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("category")}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Preço
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearPrice}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {filters.search && (
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Busca
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("search")}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
