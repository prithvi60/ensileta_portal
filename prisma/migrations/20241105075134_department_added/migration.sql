/*
  Warnings:

  - You are about to alter the column `company_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - A unique constraint covering the columns `[company_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department` to the `accessControl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accessControl" ADD COLUMN     "department" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "department" TEXT,
ALTER COLUMN "company_name" SET DATA TYPE VARCHAR(40);

-- CreateIndex
CREATE UNIQUE INDEX "users_company_name_key" ON "users"("company_name");
