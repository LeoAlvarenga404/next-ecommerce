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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Produtos em Destaque</h2>

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
