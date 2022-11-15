/*
  Warnings:

  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuario]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Fotos" DROP CONSTRAINT "Fotos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_persona_id_fkey";

-- AlterTable
ALTER TABLE "Fotos" ALTER COLUMN "usuario_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "persona_id" INTEGER,
ADD COLUMN     "rol" "Roles" NOT NULL DEFAULT 'USUARIO',
ADD COLUMN     "usuario" TEXT;

-- DropTable
DROP TABLE "Usuarios";

-- CreateIndex
CREATE UNIQUE INDEX "User_usuario_key" ON "User"("usuario");

-- AddForeignKey
ALTER TABLE "Fotos" ADD CONSTRAINT "Fotos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Personas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
