import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductAttributeType } from "@prisma/client";
export async function GET() {
  try {
    const attributes = await prisma.productAttribute.findMany({
      select: {
        attribute_id: true,
        name: true,
        unit: true,
        type: true,
      },
    });

    return NextResponse.json(attributes);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar atributos: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, unit, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }
    if (!Object.values(ProductAttributeType).includes(type)) {
      return NextResponse.json(
        { error: "Tipo de atributo inválido. Use: STRING, NUMBER ou BOOLEAN" },
        { status: 400 }
      );
    }

    const verifyAttribute = await prisma?.productAttribute?.findFirst({
      where: { name: name.trim() },
    });

    if (verifyAttribute) {
      return NextResponse.json(
        { error: "Atributo já existe" },
        { status: 409 }
      );
    }
    const newAttribute = await prisma.productAttribute.create({
      data: {
        name: name.trim(),
        unit: unit || null,
        type: type as ProductAttributeType,
      },
    });

    return NextResponse.json(newAttribute, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao criar atributo: ${error}` },
      { status: 500 }
    );
  }
}
