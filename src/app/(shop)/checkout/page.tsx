"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { checkoutSchema, type ICheckoutSchema } from "@/schemas/checkout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  Shield,
  Truck,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { IProduct } from "@/@types/product";
import Image from "next/image";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { calculateValueWithDiscount } from "@/utils/value-with-discount";
import { toast } from "sonner";
import { Cart, CartItem } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

const steps = [
  { id: 1, title: "Informações", icon: User },
  { id: 2, title: "Pagamento", icon: CreditCard },
  { id: 3, title: "Revisão", icon: Package },
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const form = useForm<ICheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      shipping: {
        zip_code: "",
        street: "",
        number: "",
        city: "",
        state: "",
        complement: "",
      },
    },
  });

  const calculateSubtotal = () => {
    return cart?.CartItem?.reduce((sum: number, item: any) => {
      return (
        sum +
        calculateValueWithDiscount(
          item.product.price,
          item.product.discount || 0
        ) *
          (item.quantity || 1)
      );
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleNext = async () => {
    let fieldsToValidate: (keyof ICheckoutSchema)[] = [];

    if (step === 1) {
      fieldsToValidate = ["name", "email", "phone", "shipping"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }

    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleCheckout = async (data: ICheckoutSchema) => {
    setLoading(true);

    if (!isAuthenticated) {
      toast.custom(
        (t) => (
          <div
            className={`
        bg-card border border-border rounded-lg shadow-lg overflow-hidden
        transition-all duration-300 ease-in-out

        max-w-md w-full
      `}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-card-foreground">
                      Acesso necessário
                    </h4>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Você precisa estar logado para finalizar a compra.
                  </p>

                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => toast.dismiss()}
                  >
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1"
                    >
                      Fazer login
                    </Link>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={() => toast.dismiss()}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ),
        {
          duration: 5000,
          id: "login-required",
          position: "top-right",
        }
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
        );
        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: responseData.sessionId,
          });
        }
      } else {
        console.error("Erro no checkout:", responseData.error);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((stepItem, index) => {
          const isCompleted = step > stepItem.id;
          const isCurrent = step === stepItem.id;
          const Icon = stepItem.icon;

          return (
            <div key={stepItem.id} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary text-primary bg-background"
                      : "border-muted-foreground text-muted-foreground bg-background"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`
                  ml-2 text-sm font-medium
                  ${
                    isCurrent
                      ? "text-foreground"
                      : isCompleted
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
              >
                {stepItem.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mx-4 transition-all
                    ${isCompleted ? "bg-primary" : "bg-muted"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
        </div>

        <StepIndicator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCheckout)}
            className="space-y-6"
          >
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Informações de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seu@email.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, Avenida..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Apt, Bloco, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Sua cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shipping.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleNext} type="button">
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          Cartão de Crédito/Débito
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Pagamento seguro processado via Stripe
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      type="button"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={handleNext} type="button">
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Revisar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Informações Pessoais
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Nome:</span>{" "}
                            {form.watch("name")}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Email:
                            </span>{" "}
                            {form.watch("email")}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Telefone:
                            </span>{" "}
                            {form.watch("phone")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Endereço de Entrega
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            {form.watch("shipping.street")},{" "}
                            {form.watch("shipping.number")}
                          </p>
                          {form.watch("shipping.complement") && (
                            <p>{form.watch("shipping.complement")}</p>
                          )}
                          <p>
                            {form.watch("shipping.city")} -{" "}
                            {form.watch("shipping.state")}
                          </p>
                          <p>CEP: {form.watch("shipping.zip_code")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Produtos
                    </h3>
                    {cart?.CartItem?.map((item: any) => {
                      const product = item.product as IProduct;

                      return (
                        <div className="space-y-3" key={product.product_id}>
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {product.ProductImage[0]?.url ? (
                                <Image
                                  src={product.ProductImage[0].url}
                                  alt={product.name}
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
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantidade: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatPriceToBrazilianCurrency(
                                  calculateValueWithDiscount(
                                    product.price,
                                    product.discount || 0
                                  )
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                por unidade
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="w-full flex items-center gap-4 justify-between">
                      <span className="font-bold">Total:</span>
                      <p className="text-lg font-semibold">
                        {formatPriceToBrazilianCurrency(total)}
                      </p>
                    </div>
                  </div>
                  <Separator />

                  <div className="pt-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">
                        Método de Pagamento
                      </h4>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">
                          Cartão de Crédito/Débito via Stripe
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      type="button"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Finalizar Compra
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
