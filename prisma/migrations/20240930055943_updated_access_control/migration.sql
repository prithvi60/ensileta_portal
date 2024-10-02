/*
  Warnings:

  - Added the required column `username` to the `accessControl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accessControl" ADD COLUMN     "username" VARCHAR(50) NOT NULL;
