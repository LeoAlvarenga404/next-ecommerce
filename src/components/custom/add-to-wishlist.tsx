import { Heart } from "lucide-react";
import { useState } from "react";

export function AddToWishlist({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleWishlist = () => {
    setIsAnimating(true);
    setIsWishlisted(!isWishlisted);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className="p-0 rounded-full transition-colors group"
      title={
        isWishlisted
          ? "Remover da lista de desejos"
          : "Adicionar à lista de desejos"
      }
    >
      <Heart
        className={`
          w-5 h-5 transition-all duration-300 transform
          ${
            isWishlisted
              ? "text-red-500 fill-red-500 scale-110"
              : "text-gray-400 hover:text-red-400 group-hover:scale-110"
          }
          ${isAnimating ? "animate-pulse scale-125" : ""}
        `}
      />
    </button>
  );
}
