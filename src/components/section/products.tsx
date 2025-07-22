"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/custom/product-card";
import { useProducts } from "@/hooks/use-products";

export function FeaturedProductCarousel() {
  const { data } = useProducts();

  const products = data?.products || [];
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium mb-3 text-foreground">
            Produtos em destaque
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          orientation="horizontal"
          className="w-full max-w-full"
        >
          <div className="relative">
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.product_id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50"
              variant="outline"
            />
            <CarouselNext
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50"
              variant="outline"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
