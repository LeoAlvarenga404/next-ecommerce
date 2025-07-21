"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/custom/image";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";

export default function CartPage() {
  const { cart, isLoadingCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(itemId);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsUpdating(null);
  };

  const removeItem = async (itemId: string) => {
    setIsUpdating(itemId);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsUpdating(null);
  };

  function calculateValueWithDiscount(price: number, discount: number) {
    return price - (price * discount) / 100;
  }

  const calculateSubtotal = () => {
    if (!cart?.CartItem) return 0;
    return cart.CartItem.reduce((sum: number, item: any) => {
      return (
        sum +
        calculateValueWithDiscount(
          item.product.price,
          item.product.discount || 0
        ) *
          item.quantity
      );
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (!cart?.CartItem || cart.CartItem.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex relative items-center justify-center gap-4 mb-8">
            <Link href="/" className="absolute left-1">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="w-full text-3xl text-center font-bold">
              Carrinho de Compras
            </h1>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Seu carrinho está vazio
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                Adicione alguns produtos incríveis ao seu carrinho para começar
                suas compras.
              </p>
              <Link href="/">
                <Button className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Ver Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex relative items-center justify-center gap-4 mb-8">
          <Link href="/" className="absolute left-1">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <Badge variant="secondary">
            {cart.CartItem.length}{" "}
            {cart.CartItem.length === 1 ? "item" : "itens"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.CartItem.map((item: any) => {
              const valueWithDiscount =
                item.product.price -
                (item.product.price * (item.product.discount || 0)) / 100;

              return (
                <Card key={item.cart_item_id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.ProductImage?.[0] ? (
                          <ProductImage
                            src={item.product.ProductImage[0].url}
                            alt={item.product.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.cart_item_id)}
                            disabled={isUpdating === item.cart_item_id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {isUpdating === item.cart_item_id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.cart_item_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating === item.cart_item_id
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.cart_item_id,
                                  item.quantity + 1
                                )
                              }
                              disabled={isUpdating === item.cart_item_id}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatPriceToBrazilianCurrency(
                                valueWithDiscount
                              )}{" "}
                              cada
                            </p>
                            <p className="text-lg font-bold">
                              {formatPriceToBrazilianCurrency(
                                valueWithDiscount * item.quantity
                              )}
                            </p>
                          </div>
                        </div>

                        {item.product.stock <= 5 && (
                          <div className="mt-3">
                            <Badge variant="destructive" className="text-xs">
                              Apenas {item.product.stock} em estoque
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPriceToBrazilianCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shipping === 0
                        ? "Grátis"
                        : `${formatPriceToBrazilianCurrency(shipping)}`}
                    </span>
                  </div>
                  {shipping > 0 && subtotal < 150 && (
                    <p className="text-xs text-muted-foreground">
                      Adicione {formatPriceToBrazilianCurrency(150 - subtotal)}{" "}
                      para frete grátis
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPriceToBrazilianCurrency(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Finalizar Compra
                  </Button>
                </Link>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Entrega em 2-5 dias úteis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>Troca grátis em 30 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
