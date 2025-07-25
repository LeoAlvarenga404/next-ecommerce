import { CartItem } from "@/components/custom/add-to-cart";

export const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const setLocalCart = (cartItems: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

export const addToLocalCart = (newItem: CartItem) => {
  const existingCart = getLocalCart();

  const existingProductIndex = existingCart.findIndex(
    (item: CartItem) => item.product.product_id === newItem.product.product_id
  );

  let updatedCart: CartItem[];

  if (existingProductIndex !== -1) {
    updatedCart = existingCart.map((item, index) =>
      index === existingProductIndex
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  } else {
    updatedCart = [...existingCart, newItem];
  }

  setLocalCart(updatedCart);
};

export const updateLocalCartQuantity = (
  productId: string,
  newQuantity: number
) => {
  const existingCart = getLocalCart();

  const updatedCart = existingCart.map((item: CartItem) =>
    item.product.product_id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );

  setLocalCart(updatedCart);
};

export const removeFromLocalCart = (productId: string) => {
  const existingCart = getLocalCart();

  const updatedCart = existingCart.filter(
    (item: CartItem) => item.product.product_id !== productId
  );

  setLocalCart(updatedCart);
};

export const clearLocalCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cart");
};

export const getTotalQuantityLocalCart = (): number => {
  const cartItems = getLocalCart();
  return cartItems.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );
};

export const getTotalPriceLocalCart = (): number => {
  const cartItems = getLocalCart();
  return cartItems.reduce((total: number, item: CartItem) => {
    const price = item.product.price || 0;
    return total + price * item.quantity;
  }, 0);
};
