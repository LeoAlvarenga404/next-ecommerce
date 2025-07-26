"use client";

import { ProductImage } from "@/components/custom/image";
import { AddToCart } from "@/components/custom/add-to-cart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { formatPriceToBrazilianCurrency } from "@/utils/formatter/price";
import { IProduct } from "@/@types/product";
import { ButtonBuyNow } from "@/components/custom/button-buy-now";

interface ProductClientProps {
  product: IProduct;
}
export default function ProductPage({ product }: ProductClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Produto não encontrado
            </h2>
            <p className="text-muted-foreground mb-4">
              O produto que você está procurando não existe ou foi removido.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.ProductImage.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.ProductImage.length - 1 ? 0 : prev + 1
    );
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const isInStock = product.stock > 0;
  const stockStatus =
    product.stock <= 5 ? "low" : product.stock <= 15 ? "medium" : "high";
  const priceWithDiscount =
    product.price - product.price * ((product?.discount || 0) / 100 || 0);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Início
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-foreground">
              Produtos
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products/${product.Category?.name}`}
              className="hover:text-foreground"
            >
              {product.Category?.name || "Categoria"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl border overflow-hidden group">
              {product.ProductImage.length > 0 ? (
                <>
                  <ProductImage
                    src={product.ProductImage[selectedImageIndex]?.url}
                    alt={`${product.name} - ${selectedImageIndex + 1}`}
                  />

                  {product.ProductImage.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {product.ProductImage.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.ProductImage.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <ProductImage
                      src={image.url}
                      alt={`Imagem ${index + 1} do produto${product.name}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    (4.8) • 245 avaliações
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description ||
                  "Este é um produto de alta qualidade que atende às suas necessidades com excelência e durabilidade."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPriceToBrazilianCurrency(priceWithDiscount)}
                </span>
                {product.discount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPriceToBrazilianCurrency(product?.price)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{product?.discount}%
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stockStatus === "high"
                      ? "bg-emerald-500"
                      : stockStatus === "medium"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    stockStatus === "high"
                      ? "text-emerald-600"
                      : stockStatus === "medium"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {isInStock
                    ? `${product.stock} unidades em estoque`
                    : "Produto esgotado"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantidade:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <AddToCart
                    product={product}
                    quantity={quantity}
                    variant="button"
                  />
                </div>
                <ButtonBuyNow product={product}/>
              </div>
            </div>
          </div>
        </div>

        {product.ProductAttributeValue.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ProductAttributeValue.map((attr) => (
                    <div
                      key={attr.attribute_id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <Label className="font-bold">{attr.attribute.name}</Label>
                      <Label className="text-gray-900">
                        {attr.value}
                        {attr.attribute.unit && ` ${attr.attribute.unit}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoria:</span>
                <span className="font-medium">{product?.Category?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disponibilidade:</span>
                <Badge variant={isInStock ? "default" : "destructive"}>
                  {isInStock ? "Em estoque" : "Esgotado"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Política de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Entrega grátis para pedidos acima de R$ 150</p>
              <p>• Lorem ipsum dolor sit amet</p>
              <p>• Lorem ipsum dolor sit amet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
