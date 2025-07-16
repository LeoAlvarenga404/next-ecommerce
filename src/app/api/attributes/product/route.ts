import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, attribute_id, value } = body;

    if (!product_id || !attribute_id) {
      return NextResponse.json(
        { error: "É necessário inserir o produto e atributo" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        product_id: product_id,
       },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const existingAttribute = await prisma.productAttribute.findUnique({
      where: { attribute_id },
    });
    if (!existingAttribute) {
      return NextResponse.json(
        { error: "Atributo não encontrado" },
        { status: 404 }
      );
    }

    const newProductAttributeValue = await prisma.productAttributeValue.create({
      data: {
        product_id,
        attribute_id,
        value,
      },
    });

    return NextResponse.json(newProductAttributeValue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao criar atribudo do produto: ${error}` },
      { status: 500 }
    );
  }
}
