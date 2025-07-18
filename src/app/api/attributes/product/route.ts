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

    if (!existingProduct.category_id) {
      return NextResponse.json(
        { error: "Produto não possui categoria vinculada" },
        { status: 400 }
      );
    }

    const categoryAttribute = await prisma.categoryAttribute.findUnique({
      where: {
        category_id_attribute_id: {
          category_id: existingProduct.category_id,
          attribute_id: attribute_id,
        },
      },
    });

    if (!categoryAttribute) {
      return NextResponse.json(
        { error: "Este atributo não está vinculado à categoria do produto" },
        { status: 400 }
      );
    }

    const existingValue = await prisma.productAttributeValue.findUnique({
      where: {
        product_id_attribute_id: {
          product_id: product_id,
          attribute_id: attribute_id,
        },
      },
    });

    if (existingValue) {
      const updatedValue = await prisma.productAttributeValue.update({
        where: {
          product_id_attribute_id: {
            product_id: product_id,
            attribute_id: attribute_id,
          },
        },
        data: {
          value: String(value),
        },
      });

      return NextResponse.json(
        {
          message: "Atributo do produto atualizado com sucesso",
          data: updatedValue,
        },
        { status: 200 }
      );
    }

    const newProductAttributeValue = await prisma.productAttributeValue.create({
      data: {
        product_id,
        attribute_id,
        value: String(value),
      },
    });

    return NextResponse.json(
      {
        message: "Atributo do produto criado com sucesso",
        data: newProductAttributeValue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro na API de atributos do produto:", error);
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
