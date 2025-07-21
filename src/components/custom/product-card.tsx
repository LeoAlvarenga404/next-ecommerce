import type { IProduct } from "@/@types/product";
import { ProductImage } from "./image";
import { AddToWishlist } from "./add-to-wishlist";
import { Card } from "@/components/ui/card";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCart } from "./add-to-cart";
import { calculateValueWithDiscount } from "@/utils/value-with-discount";

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
        <div className="absolute top-3 right-3 z-10">
          <AddToWishlist productId={product.product_id} />
        </div>
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
          <Link href={`/product/${product.product_id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full text-sm h-9 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Ver Detalhes
            </Button>
          </Link>
          <div className="flex items-center">
            <AddToCart
              productId={product.product_id}
              quantity={1}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
