import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do produto inválido" },
        { status: 400 }
      );
    }
    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        Category: true,
        ProductImage: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar o produto: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do produto inválido" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { product_id: id },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao atualizar o produto: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do produto inválido" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { product_id: id },
    });

    return NextResponse.json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao excluir o produto: ${error}` },
      { status: 500 }
    );
  }
}
