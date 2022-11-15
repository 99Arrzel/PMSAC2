/*
  Warnings:

  - Added the required column `camara_id` to the `Registros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registros" ADD COLUMN     "camara_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_camara_id_fkey" FOREIGN KEY ("camara_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
