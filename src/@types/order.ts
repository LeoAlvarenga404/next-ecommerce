export interface IOrder {
  order_id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address_id: string;
  tracking_code: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  url_payment: string;
  created_at: string;
  updated_at: string;
  couponCode: string | null;
  shippingMethodId: string | null;
  shipping_address: {
    address_id: string;
    user_id: string;
    street: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
    complement: string;
  };
  OrderItem: Array<{
    order_item_id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    product: {
      product_id: string;
      name: string;
      ProductImage: Array<{
        url: string;
      }>;
    };
  }>;
}
