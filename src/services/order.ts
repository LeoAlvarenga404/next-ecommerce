import { IOrder } from "@/@types/order";

export const orderService = {
  async getOrders(): Promise<IOrder[]> {
    try {
      const res = await fetch("/api/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
