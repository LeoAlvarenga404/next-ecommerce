import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const wishlist = await prisma.wishlist.findFirst({
      where: { user_id: session.user_id },
      include: {
        WishlistItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist vazia" }, { status: 200 });
    }

    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar a wishlist", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId } = body;

    if (!productId || !userId) {
      return NextResponse.json(
        { error: "Erro ao adicionar a wishlist" },
        { status: 400 }
      );
    }

    let wishlist = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          user_id: userId,
        },
      });
    }

    const wishListItem = await prisma.wishlistItem.create({
      data: {
        wishlist_id: wishlist.id,
        product_id: productId,
      },
    });

    if (!wishListItem.id) {
      return NextResponse.json(
        { error: "Erro ao adicionar o produto à wishlist" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Produto adicionado à wishlist com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao adicionar produto à wishlist:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar produto à wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId } = body;

    if (!productId || !userId) {
      return NextResponse.json(
        { error: "Erro ao remover da wishlist" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        product_id: productId,
        wishlist: {
          user_id: userId,
        },
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Produto não encontrado na wishlist" },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return NextResponse.json(
      { message: "Produto removido da wishlist com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover produto da wishlist:", error);
    return NextResponse.json(
      { error: "Erro ao remover produto da wishlist" },
      { status: 500 }
    );
  }
}
