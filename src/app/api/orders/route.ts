// orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { user_id: session.user_id },
      include: {
        OrderItem: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao buscar pedidos: ${error}` },
      { status: 500 }
    );
  }
}
