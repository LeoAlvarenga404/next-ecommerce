"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/custom/product-card";
import { IProduct } from "@/@types/product";
import { useCallback, useState } from "react";

interface FeaturedProductCarouselProps {
  products: IProduct[];
}

export function FeaturedProductCarousel({
  products,
}: FeaturedProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollToPrevious = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  const scrollToNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
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
          onClick={scrollToPrevious}
        />
        <CarouselNext
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50"
          variant="outline"
          onClick={scrollToNext}
        />
      </div>
    </Carousel>
  );
}
