import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: session.user_id },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const lineItems = cart.CartItem.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(item.product.price * 100), // em centavos
      },
      quantity: item.quantity,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        user_id: session.user_id,
        cart_id: cart.cart_id,
      },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar o checkout", details: error },
      { status: 500 }
    );
  }
}
