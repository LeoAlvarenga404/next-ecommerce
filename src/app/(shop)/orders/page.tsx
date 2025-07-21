"use client";

import { useOrders } from "@/hooks/use-order";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, CreditCard, Truck } from "lucide-react";
import Image from "next/image";
import { IOrder } from "@/@types/order";

// enum OrderStatus {
//   PAID
//   FAILED
//   PENDING
//   CONFIRMED
//   PROCESSING
//   SHIPPED
//   DELIVERED
//   CANCELLED
// }
const getStatusVariant = (status: string) => {
  switch (status) {
    case "PAID":
      return "success";
    case "FAILED":
      return "destructive";
    case "PENDING":
      return "secondary";
    case "CONFIRMED":
      return "info";
    case "PROCESSING":
      return "warning";
    case "SHIPPED":
      return "info";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: "Pendente",
    PAID: "Pago",
    FAILED: "Falhou",
    CONFIRMED: "Confirmado",
    PROCESSING: "Processando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };
  return statusMap[status] || status;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function OrdersPage() {
  const { data: orders } = useOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Nenhum pedido encontrado
              </h2>
              <p className="text-muted-foreground text-center">
                Você ainda não fez nenhum pedido. Quando fizer, eles aparecerão
                aqui.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function NavigateToPaymentLink(link: string) {
    window.location.href = link;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

        <div className="space-y-6">
          {orders.map((order: IOrder) => (
            <Card key={order.order_id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Pedido #{order.order_id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <div className="text-lg font-semibold">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Produtos
                  </h3>
                  <div className="space-y-3">
                    {order.OrderItem.map((item) => (
                      <div
                        key={item.order_item_id}
                        className="flex items-center gap-4"
                      >
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.ProductImage[0]?.url ? (
                            <Image
                              src={item.product.ProductImage[0].url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.unit_price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            por unidade
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço de Entrega
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">
                      {order.shipping_address.street},{" "}
                      {order.shipping_address.number}
                    </p>
                    {order.shipping_address.complement && (
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address.complement}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.city} -{" "}
                      {order.shipping_address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {order.shipping_address.zip_code}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.tracking_code && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Rastreamento
                      </h3>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="font-mono text-sm">
                          {order.tracking_code}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.couponCode && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Cupom Aplicado
                      </h3>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="font-mono text-sm">{order.couponCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              {order.status !== "PAID" && order.status !== "FAILED" && (
                <CardFooter className="flex justify-end">
                  <Button
          
                    onClick={() => NavigateToPaymentLink(order.url_payment)}
                  >
                    Continuar Pagamento
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
