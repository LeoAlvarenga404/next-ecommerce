import type { IProduct } from "@/@types/product";
import { ProductImage } from "./image";
import { Card } from "@/components/ui/card";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCart } from "./add-to-cart";
import { calculateValueWithDiscount } from "@/utils/value-with-discount";
import { ButtonBuyNow } from "./button-buy-now";

export function ProductCard({ product }: { product: IProduct }) {
  const price = calculateValueWithDiscount(
    product.price,
    product.discount || 0
  );
  const hasDiscount = (product.discount || 0) > 0;

  return (
    <Card
      key={product.product_id}
      className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white rounded-xl overflow-hidden p-0 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ProductImage src={product?.ProductImage[0]?.url} alt={product.name} />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-1 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.Category?.name || "Sem categoria"}
          </p>
        </div>

        <div className="space-y-1 mb-4 flex-1">
          <div className="min-h-[3.5rem] flex flex-col justify-end">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPriceToBrazilianCurrency(product.price)}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    %{product.discount}
                  </Badge>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {formatPriceToBrazilianCurrency(price)}
                </span>
              </div>
            ) : (
              <div className="flex items-end h-full">
                <span className="text-lg font-bold text-gray-900">
                  {formatPriceToBrazilianCurrency(price)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <ButtonBuyNow product={product} />
          <div className="flex items-center">
            <AddToCart product={product} quantity={1} variant="icon" />
          </div>
        </div>
      </div>
    </Card>
  );
}
