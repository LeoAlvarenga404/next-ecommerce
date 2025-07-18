import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category_id");

  if (!categoryId) {
    return NextResponse.json(
      { error: "É necessário informar o ID da categoria" },
      { status: 400 }
    );
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        ...(categoryId && { category_id: categoryId }),
      },
      include: {
        CategoryAttribute: {
          select: {
            attribute: {
              select: {
                attribute_id: true,
                name: true,
                unit: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar categorias: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category_id, attributes_id } = body;

    if (
      !category_id ||
      !Array.isArray(attributes_id) ||
      attributes_id.length === 0
    ) {
      return NextResponse.json(
        { error: "É necessário inserir a categoria e pelo menos um atributo" },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { category_id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    const existingAttributes = await prisma.productAttribute.findMany({
      where: { attribute_id: { in: attributes_id } },
    });

    if (existingAttributes.length !== attributes_id.length) {
      return NextResponse.json(
        { error: "Um ou mais atributos não encontrados" },
        { status: 404 }
      );
    }

    // Check for existing associations
    const existingAssociations = await prisma.categoryAttribute.findMany({
      where: {
        category_id,
        attribute_id: { in: attributes_id },
      },
    });

    // Filter out already associated attributes
    const existingAttributeIds = existingAssociations.map(
      (assoc) => assoc.attribute_id
    );
    const newAttributeIds = attributes_id.filter(
      (id) => !existingAttributeIds.includes(id)
    );

    if (newAttributeIds.length === 0) {
      return NextResponse.json(
        { message: "Todos os atributos já estão associados a esta categoria" },
        { status: 200 }
      );
    }

    const categoryAttributes = await prisma.categoryAttribute.createMany({
      data: newAttributeIds.map((attribute_id) => ({
        category_id,
        attribute_id,
      })),
    });

    return NextResponse.json(
      {
        message: `${newAttributeIds.length} atributo(s) vinculado(s) à categoria com sucesso`,
        associatedCount: newAttributeIds.length,
        skippedCount: existingAttributeIds.length,
        categoryAttributes,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error associating attributes to category:", error);
    return NextResponse.json(
      { error: `Erro ao vincular atributo a categoria: ${error}` },
      { status: 500 }
    );
  }
}
