"use client";

import React from "react";
import { useCallback, useEffect, useState } from "react";
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
    title: "Novos Lançamentos",
    subtitle: "Descubra os tênis mais esperados",
    image: "/api/placeholder/800/400",
    cta: "Comprar Agora",
    bgGradient: "from-blue-600 to-purple-700",
  },
  {
    id: 2,
    title: "Promoção Relâmpago",
    subtitle: "Até 50% OFF em sneakers selecionados",
    image: "/api/placeholder/800/400",
    cta: "Ver Ofertas",
    bgGradient: "from-red-500 to-orange-600",
  },
  {
    id: 3,
    title: "Coleção Streetwear",
    subtitle: "Para quem tem estilo próprio",
    image: "/api/placeholder/800/400",
    cta: "Explorar",
    bgGradient: "from-green-500 to-teal-600",
  },
  {
    id: 4,
    title: "Air Jordan Collection",
    subtitle: "Lendários designs, qualidade incomparável",
    image: "/api/placeholder/800/400",
    cta: "Ver Coleção",
    bgGradient: "from-gray-800 to-black",
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
            {carouselData.map((item, index) => (
              <CarouselItem key={item.id}>
                <div className="relative overflow-hidden">
                  <div
                    className={cn(
                      "relative h-[30rem] bg-gradient-to-r flex items-center justify-center",
                      item.bgGradient
                    )}
                  >
                    <h1 className="text-9xl text-white">{index}</h1>
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
