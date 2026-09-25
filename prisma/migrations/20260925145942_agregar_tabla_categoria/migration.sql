/*
  Warnings:

  - You are about to drop the column `categoria_fk` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `id_categoria_fk` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gasto" DROP CONSTRAINT "Gasto_categoria_fk_fkey";

-- AlterTable
ALTER TABLE "Gasto" DROP COLUMN "categoria_fk",
ADD COLUMN     "id_categoria_fk" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_id_categoria_fk_fkey" FOREIGN KEY ("id_categoria_fk") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
