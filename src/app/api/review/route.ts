import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Erro ao encontrar ID do produto" },
      { status: 400 }
    );
  }

  const reviews = await prisma.review.findMany({
    where: { product_id: productId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(reviews, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    let session = await getSession();

    if (!productId || rating === undefined) {
      return NextResponse.json(
        { error: "Dados inválidos para o review" },
        { status: 400 }
      );
    }

    let hasReview = await prisma.review.findFirst({
      where: {
        product_id: productId,
        user_id: session?.user_id,
      },
    });

    let paidProduct = await prisma.order.findFirst({
      where: {
        user_id: session?.user_id,
        status: "PAID",
        OrderItem: {
          some: {
            product_id: productId,
          },
        },
      },
    });

    if (!paidProduct) {
      return NextResponse.json(
        { error: "Você precisa comprar o produto para deixar um review" },
        { status: 403 }
      );
    }
    if (hasReview) {
      return NextResponse.json(
        { error: "Você já deixou um review para este produto" },
        { status: 400 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const review = await prisma.review.create({
      data: {
        product_id: productId,
        user_id: session?.user_id,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao adicionar o review", details: error },
      { status: 500 }
    );
  }
}
