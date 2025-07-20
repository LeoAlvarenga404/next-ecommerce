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
import { Badge } from "@/components/ui/badge";
import {
  X,
  Filter,
  Search,
  DollarSign,
  Tag,
  SortAsc,
  RotateCcw,
} from "lucide-react";
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

  const activeFiltersCount = [
    filters.category,
    filters.minPrice || filters.maxPrice,
    filters.search,
    filters.sortBy,
  ].filter(Boolean).length;

  return (
    <Card className="w-80 h-fit sticky top-4 shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}{" "}
                  ativo{activeFiltersCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-3 text-xs font-medium hover:bg-destructive/10 hover:text-destructive-foreground border-destructive/20 text-destructive"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Buscar Produto
            </Label>
            {filters.search && (
              <Badge variant="secondary" className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("search")}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite o nome do produto..."
              value={filters.search || ""}
              onChange={(e) => setFilter("search", e.target.value)}
              className="pl-10 h-10 border-gray-200 focus:border-primary"
            />
          </div>
        </div>

        <Separator className="bg-gray-200" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Categoria
            </Label>
            {filters.category && (
              <Badge variant="secondary" className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCategory}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
          <Select
            value={filters.category || undefined}
            onValueChange={(value) => setFilter("category", value)}
          >
            <SelectTrigger className="h-10 border-gray-200 focus:border-primary">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias Disponíveis</SelectLabel>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse"></div>
                      Carregando...
                    </div>
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

        <Separator className="bg-gray-200" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Faixa de Preço
            </Label>
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearPrice}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600 font-medium">
                Mínimo
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
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
                  className="pl-8 h-9 border-gray-200 focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600 font-medium">
                Máximo
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
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
                  className="pl-8 h-9 border-gray-200 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {(filters.minPrice || filters.maxPrice) && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-sm text-primary font-medium">
                Faixa selecionada: R$ {filters.minPrice || 0} - R${" "}
                {filters.maxPrice || "∞"}
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Ordenação
            </Label>
          </div>

          <div className="space-y-3">
            <Select
              value={filters.sortBy || undefined}
              onValueChange={(value) => setFilter("sortBy", value)}
            >
              <SelectTrigger className="h-10 border-gray-200 focus:border-primary">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Critério de Ordenação</SelectLabel>
                  <SelectItem value="name">Nome do Produto</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {filters.sortBy && (
              <Select
                value={filters.sortOrder || "asc"}
                onValueChange={(value) => setFilter("sortOrder", value)}
              >
                <SelectTrigger className="h-10 border-gray-200 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Direção</SelectLabel>
                    <SelectItem value="asc">Crescente (A → Z)</SelectItem>
                    <SelectItem value="desc">Decrescente (Z → A)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <>
            <Separator className="bg-gray-200" />
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Filtros Aplicados
              </Label>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge
                    variant="default"
                    className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Categoria
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("category")}
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1"
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Preço
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearPrice}
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.search && (
                  <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Busca
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter("search")}
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.sortBy && (
                  <Badge
                    variant="default"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1"
                  >
                    <SortAsc className="h-3 w-3 mr-1" />
                    Ordenação
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearFilter("sortBy");
                        clearFilter("sortOrder");
                      }}
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
