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

    const totalAmount = cart.CartItem.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        user_id: session.user_id,
        total: totalAmount,
        status: "PENDING",
      },
    });

    await prisma.orderItem.createMany({
      data: cart.CartItem.map((item) => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
    });

    const lineItems = cart.CartItem.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        user_id: session.user_id,
        cart_id: cart.cart_id,
        order_id: order.order_id,
      },
    });

    await prisma.order.update({
      where: { order_id: order.order_id },
      data: { stripe_session_id: stripeSession.id },
    });

    return NextResponse.json({
      sessionId: stripeSession.id,
      orderId: order.order_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar o checkout", details: error },
      { status: 500 }
    );
  }
}
