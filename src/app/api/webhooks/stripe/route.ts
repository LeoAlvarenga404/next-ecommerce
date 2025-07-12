import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        if (!session.metadata?.user_id || !session.metadata?.cart_id) {
          console.error("Metadados são obrigatórios", session.metadata);
          return NextResponse.json(
            { error: "Metadados obrigatórios não encontrados" },
            { status: 400 }
          );
        }

        await prisma.order.update({
          where: { order_id: session.metadata.order_id },
          data: {
            status: "PAID",
            stripe_payment_intent_id: session.payment_intent as string,
          },
        });

        const cart = await prisma.cart.findUnique({
          where: { cart_id: session.metadata?.cart_id },
          include: {
            CartItem: {
              include: {
                product: true,
              },
            },
          },
        });

        if (cart) {
          for (const item of cart.CartItem) {
            await prisma.product.update({
              where: { product_id: item.product_id },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }

          await prisma.cartItem.deleteMany({
            where: { cart_id: cart.cart_id },
          });
        }
        break;
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;

        const failedOrder = await prisma.order.findFirst({
          where: { stripe_payment_intent_id: failedPayment.id },
        });

        if (failedOrder) {
          await prisma.order.update({
            where: { order_id: failedOrder.order_id },
            data: { status: "FAILED" },
          });
        }

        break;

      default:
        console.warn(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook do Stripe:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
