/*
  Warnings:

  - A unique constraint covering the columns `[carnet]` on the table `Personas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Personas_carnet_key" ON "Personas"("carnet");
