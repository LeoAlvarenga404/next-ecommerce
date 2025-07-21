import { ChevronRight, Search, Star } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import {
  useFilteredProducts,
  useProductFilter,
} from "@/hooks/use-product-filter";
import Image from "next/image";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { calculateValueWithDiscount } from "@/utils/value-with-discount";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { IProduct } from "@/@types/product";
export function SearchProducts() {
  const [search, setSearch] = useState("");
  const { filters, setFilter } = useProductFilter();
  const { data } = useFilteredProducts({ ...filters, search });
  const products = data?.products || [];

  function handleNavitateToProduct(productId: string) {
    setFilter("search", "");
    setSearch("");
    window.location.href = `/product/${productId}`;
  }

  const isLoading = !data;

  return (
    <div className="relative w-full max-w-4xl">
      <Label
        htmlFor="search"
        className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"
      >
        <Search size={16} className="text-muted-foreground" />
      </Label>
      <Input
        id="search"
        placeholder="Busque por produtos..."
        className="pl-9"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {data && search.length > 0 && (
        <Card className="absolute gap-1 w-full z-99">
          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {products.slice(0, 5).map((product: IProduct, index: number) => (
            <div
              key={product.product_id}
              className="group cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-lg"
              onClick={() => handleNavitateToProduct(product.product_id)}
            >
              <div className="flex items-start gap-3 p-3">
                <div className="relative flex-shrink-0 rounded-md bg-gray-100">
                  <Image
                    src={product.ProductImage[0].url}
                    alt={product.name}
                    width={64}
                    height={64}
                    quality={70}
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {(product.discount || 0) > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1 overflow-hidden">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-nowrap">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground text-nowrap">
                      {formatPriceToBrazilianCurrency(
                        calculateValueWithDiscount(
                          product.price,
                          product.discount || 0
                        )
                      )}
                    </span>

                    {(product.discount || 0) > 0 && (
                      <span className="text-xs text-muted-foreground line-through text-nowrap">
                        {formatPriceToBrazilianCurrency(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground text-nowrap">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>Mais vendido</span>
                  </div>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {index < products.slice(0, 5).length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
