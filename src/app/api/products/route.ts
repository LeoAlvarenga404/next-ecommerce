import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;
    const where = category ? { category_id: category } : {};

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        Category: true,
        ProductImage: true,
      },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        sku: data.sku,
        category_id: data.category_id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao criar o produto: ${error}` },
      { status: 500 }
    );
  }
}


