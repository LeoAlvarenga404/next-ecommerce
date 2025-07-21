/*
  Warnings:

  - A unique constraint covering the columns `[url_payment]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "url_payment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_url_payment_key" ON "Order"("url_payment");
