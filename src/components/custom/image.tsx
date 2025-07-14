import Image from "next/image";
import { useState } from "react";

export function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
  blur?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        quality={80}
        loading="lazy"
        className="object-cover"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
