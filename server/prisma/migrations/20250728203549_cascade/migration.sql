-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
