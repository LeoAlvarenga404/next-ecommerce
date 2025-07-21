import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const { session } = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session?.user_id },
      include: {
        CartItem: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { user_id: session?.user_id },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });
      return NextResponse.json(newCart, { status: 200 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar o carrinho", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { product_id, quantity } = await request.json();
    if (!product_id || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Produto e quantidade são obrigatórios" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { product_id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Estoque insuficiente" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { user_id: session?.user_id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: session?.user_id },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.cart_id,
        product_id,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { cart_item_id: existingItem.cart_item_id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              ProductImage: true,
            },
          },
        },
      });

      return NextResponse.json(updatedItem, { status: 200 });
    } else {
      const newItem = await prisma.cartItem.create({
        data: {
          cart_id: cart.cart_id,
          product_id,
          quantity,
        },
        include: {
          product: {
            include: {
              ProductImage: true,
            },
          },
        },
      });
      return NextResponse.json(newItem, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao adicionar item ao carrinho", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { quantity } = await request.json();
    const { id } = params;

    await prisma.cartItem.update({
      where: { cart_item_id: id },
      data: { quantity },
    });

    return NextResponse.json({ message: "Quantidade atualizada" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar item", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    await prisma.cartItem.delete({
      where: { cart_item_id: id },
    });

    return NextResponse.json({ message: "Item removido do carrinho" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao remover item", details: error },
      { status: 500 }
    );
  }
}
