/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `Fotos` table. All the data in the column will be lost.
  - You are about to drop the column `edad` on the `Personas` table. All the data in the column will be lost.
  - Added the required column `persona_id` to the `Fotos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fotos" DROP CONSTRAINT "Fotos_usuario_id_fkey";

-- AlterTable
ALTER TABLE "Fotos" DROP COLUMN "usuario_id",
ADD COLUMN     "persona_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Personas" DROP COLUMN "edad",
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "foto_url" TEXT;

-- AddForeignKey
ALTER TABLE "Fotos" ADD CONSTRAINT "Fotos_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
