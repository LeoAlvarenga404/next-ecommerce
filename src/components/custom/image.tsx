import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
  blur?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = src || "/placeholder.png";

  return (
    <div className="relative w-full h-full group">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">Imagem não disponível</span>
        </div>
      )}

      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className={`
          object-cover transition-all duration-300 
          ${isLoading ? "opacity-0" : "opacity-100"}
          ${hasError ? "hidden" : "block"}
          group-hover:scale-105
        `}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={false}
        quality={85}
      />
    </div>
  );
}
