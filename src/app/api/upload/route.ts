import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { productId, imageUrl } = await request.json();

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID and image URL são obrigatórios" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { product_id: productId },
      data: {
        ProductImage: {
          create: {
            url: imageUrl,
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao processar o upload:", error);
    return NextResponse.json(
      { error: "Erro ao processar o upload" },
      { status: 500 }
    );
  }
}
