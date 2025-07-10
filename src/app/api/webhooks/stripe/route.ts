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

        const order = await prisma.order.create({
          data: {
            user_id: session.metadata?.user_id,
            total: session.amount_total! / 100,
            status: "PAID",
            stripe_session_id: session.id,
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
          await prisma.orderItem.createMany({
            data: cart.CartItem.map((item) => ({
              order_id: order.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.product.price,
            })),
          });

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
        await prisma.order.update({
          where: { stripe_payment_intent_id: failedPayment.id },
          data: { status: "FAILED" },
        });
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
