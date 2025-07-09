/*
  Warnings:

  - A unique constraint covering the columns `[stripe_session_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripe_payment_intent_id" TEXT,
ADD COLUMN     "stripe_session_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripe_session_id_key" ON "Order"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripe_payment_intent_id_key" ON "Order"("stripe_payment_intent_id");
