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

type Banner = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  url_link: string | null;
};

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const AUTOPLAY_DELAY = 4000;

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

  const goToNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      goToNext();
    }, AUTOPLAY_DELAY);

    return () => {
      clearInterval(interval);
    };
  }, [api, goToNext, isHovered]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const handleBannerClick = (banner: Banner) => {
    if (banner.url_link) {
      window.open(banner.url_link, "_blank");
    }
  };

  return (
    <section className="relative w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={banner.id}>
                <div
                  className={cn(
                    "relative overflow-hidden",
                    banner.url_link ? "cursor-pointer" : ""
                  )}
                  onClick={() => handleBannerClick(banner)}
                >
                  <div className="relative w-full aspect-[2160/600]">
                    <Image
                      src={banner.image_url || "/placeholder-banner.jpg"}
                      alt={banner.title || `Banner ${index + 1}`}
                      fill
                      quality={100}
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-banner.jpg";
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center  space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "transition-all duration-300",
              current === index + 1
                ? "w-8 h-3 bg-accent rounded-full"
                : "w-3 h-3 bg-primary-foreground hover:bg-gray-400 rounded-full"
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
