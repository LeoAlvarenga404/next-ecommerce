import { Star } from "lucide-react";
import { useState } from "react";

export function AddToWishlist({ productId }: { productId: string }) {
  const [wishlist, setWishlist] = useState(false);

  console.log("add to wishlist", productId);
  return (
    <button className="cursor-pointer">
      {wishlist ? (
        <Star
          className="text-amber-500"
          fill="currentColor"
          onClick={() => {
            setWishlist(false);
          }}
        />
      ) : (
        <Star
          className="text-gray-600"
          onClick={() => {
            setWishlist(true);
          }}
        />
      )}
    </button>
  );
}
