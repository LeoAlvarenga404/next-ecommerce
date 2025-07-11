import { useQuery, useMutation } from "@tanstack/react-query";

const getCart = async () => {
  const response = await fetch("/api/cart");
  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }
  return response.json();
};

const addToCart = async (productId: string, quantity: number) => {
  const response = await fetch("/api/cart/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
    }),
  });
  if (!response.ok) {
    throw new Error("Falha ao adicionar ao carrinho");
  }
  return response.json();
};

const removeFromCart = async (productId: string) => {
  const response = await fetch(`/api/cart/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Falha ao remover do carrinho");
  }
  return response.json();
};

export const useCart = () => {
  const { data: cart, refetch: refetchCart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const { mutate: addItem } = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: () => {
      refetchCart();
    },
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      refetchCart();
    },
  });

  return {
    cart,
    addItem,
    removeItem,
  };
};
