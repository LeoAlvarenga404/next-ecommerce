"use client";

import React from "react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const carouselData = [
  {
    id: 1,
    image: "/banner-headphone.webp",
    alt: "Banner 1",
  },
  {
    id: 2,
    image: "/banner-headphone.webp",
    alt: "Banner 2",
  },
  {
    id: 3,
    image: "/banner-headphone.webp",
    alt: "Banner 3",
  },
];

export function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="relative w-full">
      <div>
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselData.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative overflow-hidden">
                  <div className="relative w-full aspect-[2160/600]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      quality={100}
                      className="object-cover"
                      priority={item.id === 1}
                      sizes="100vw"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="relative flex justify-center -mt-5 space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "transition-all duration-300",
              current === index + 1
                ? "w-8 h-3 bg-primary rounded-full"
                : "w-3 h-3 bg-primary-foreground hover:bg-gray-400 rounded-full"
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
