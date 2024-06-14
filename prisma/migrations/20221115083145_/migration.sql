/*
  Warnings:

  - You are about to drop the column `email` on the `Personas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Personas" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3);
