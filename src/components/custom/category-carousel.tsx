"use client";

import { useCallback, useState } from "react";
import { FeaturedCategoryItem } from "./featured-category-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProductCategory } from "@/@types/product";

interface CategoryCarouselProps {
  categories: IProductCategory[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
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
    <div className="relative">
      <div className="absolute -top-14 right-0 flex items-center gap-2 z-10">
        <button
          onClick={scrollToPrevious}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
          aria-label="Categoria anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={scrollToNext}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
          aria-label="Próxima categoria"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.category_id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/7"
            >
              <FeaturedCategoryItem data={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
