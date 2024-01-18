/*
  Warnings:

  - You are about to drop the column `address_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `current_address_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_address_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "address_id",
ADD COLUMN     "current_address_id" TEXT NOT NULL,
ADD COLUMN     "delivery_address_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_current_address_id_fkey" FOREIGN KEY ("current_address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
