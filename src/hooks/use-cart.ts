import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  addToLocalCart,
  getLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  getTotalQuantityLocalCart,
  clearLocalCart,
} from "./use-local-cart";
import { IProduct } from "@/@types/product";

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getCart = async () => {
    if (!user) {
      return getLocalCart();
    }
    const response = await fetch("/api/cart");
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return response.json();
  };

  const addToCart = async (product: IProduct, quantity: number) => {
    if (!user) {
      addToLocalCart({ product, quantity });
      return { success: true };
    }
    const response = await fetch("/api/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product.product_id,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      throw new Error("Falha ao adicionar ao carrinho");
    }
    return response.json();
  };

  const updateQuantityInCart = async (product: IProduct, quantity: number) => {
    if (!user) {
      updateLocalCartQuantity(product.product_id, quantity);
      return { success: true };
    }
    const response = await fetch(`/api/cart/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: product.product_id, quantity }),
    });
    if (!response.ok) {
      throw new Error("Falha ao atualizar a quantidade");
    }
    return response.json();
  };

  const getTotalQuantity = () => {
    if (!user) {
      return getTotalQuantityLocalCart();
    }
    const cartData = queryClient.getQueryData(["cart", user?.user_id]) as
      | { totalQuantity?: { CartItem: number } }
      | undefined;
    return cartData?.totalQuantity ?? 0;
  };

  const syncLocalCartToServer = async () => {
    if (!user) {
      return;
    }
    const localCart = getLocalCart();
    if (localCart.length === 0) return;

    for (const item of localCart) {
      await addToCart(item.product, item.quantity);
    }

    clearLocalCart();
    queryClient.invalidateQueries({ queryKey: ["cart", user?.user_id] });
    return { success: true };
  };

  const removeFromCart = async (product: IProduct) => {
    if (!user) {
      removeFromLocalCart(product.product_id);
      return { success: true };
    }
    const response = await fetch(`/api/cart/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.product_id,
      }),
    });
    if (!response.ok) {
      throw new Error("Falha ao remover do carrinho");
    }
    return response.json();
  };

  const {
    data: cart,
    refetch: refetchCart,
    isLoading: isLoadingCart,
  } = useQuery({
    queryKey: ["cart", user?.user_id],
    queryFn: getCart,
  });

  const { mutate: addItem, isPending: isAddingItem } = useMutation({
    mutationFn: ({
      product,
      quantity,
    }: {
      product: IProduct;
      quantity: number;
    }) => addToCart(product, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user_id] });
    },
  });

  const { mutate: removeItem, isPending: isRemovingItem } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.user_id] });
    },
  });

  const { mutate: updateItemQuantity, isPending: isUpdatingQuantity } =
    useMutation({
      mutationFn: ({
        product,
        quantity,
      }: {
        product: IProduct;
        quantity: number;
      }) => updateQuantityInCart(product, quantity),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart", user?.user_id] });
      },
    });

  return {
    cart,
    addItem,
    isLoadingCart,
    isAddingItem,
    isRemovingItem,
    isUpdatingQuantity,
    refetchCart,
    getTotalQuantity,
    syncLocalCartToServer,
    updateItemQuantity,
    removeItem,
  };
};
