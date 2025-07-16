import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const productCategory = await prisma.product.findUnique({
      where: { product_id: id },
      select: { category_id: true },
    });

    if (!productCategory) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { category_id: productCategory?.category_id ?? undefined },
      select: { name: true },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar categoria: ${error}` },
      { status: 500 }
    );
  }
}
