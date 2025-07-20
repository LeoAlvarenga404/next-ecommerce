import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { checkoutSchema } from "@/schemas/checkout";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const data = await request.json();
    const parsedBody = checkoutSchema.safeParse(data);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
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
      return (
        sum +
        (item.product.price -
          item.product.price * ((item.product?.discount || 0) / 100 || 0)) *
          item.quantity
      );
    }, 0);

    let shippingAddress = await prisma.userAddress.findFirst({
      where: {
        user_id: session.user_id,
        street: parsedBody.data.shipping.street,
        city: parsedBody.data.shipping.city,
        state: parsedBody.data.shipping.state,
        zip_code: parsedBody.data.shipping.zip_code,
      },
    });

    if (!shippingAddress) {
      shippingAddress = await prisma.userAddress.create({
        data: {
          user_id: session.user_id,
          zip_code: parsedBody.data.shipping.zip_code,
          number: parsedBody.data.shipping.number,
          street: parsedBody.data.shipping.street,
          state: parsedBody.data.shipping.state,
          city: parsedBody.data.shipping.city,
          complement: parsedBody.data.shipping.complement || "",
        },
      });
    }

    const order = await prisma.order.create({
      data: {
        user_id: session.user_id,
        total: totalAmount,
        status: "PENDING",
        shipping_address_id: shippingAddress?.address_id,
      },
    });

    await prisma.orderItem.createMany({
      data: cart.CartItem.map((item) => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price:
          item.product.price * (1 - (item.product.discount || 0) / 100) * 100,
      })),
    });

    const lineItems = cart.CartItem.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(
          item.product.price * (1 - (item.product.discount || 0) / 100) * 100
        ),
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

    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.cart_id },
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
    console.error("Erro ao processar o checkout :", error);
    return NextResponse.json(
      { error: "Erro ao processar o checkout", details: error },
      { status: 500 }
    );
  }
}
