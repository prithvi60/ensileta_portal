/*
  Warnings:

  - Added the required column `userId` to the `Kanban_Cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kanban_Cards" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Kanban_Cards" ADD CONSTRAINT "Kanban_Cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
