/*
  Warnings:

  - You are about to drop the column `cep` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "cep",
DROP COLUMN "city",
DROP COLUMN "complement",
DROP COLUMN "district",
DROP COLUMN "number",
DROP COLUMN "state",
DROP COLUMN "street";
