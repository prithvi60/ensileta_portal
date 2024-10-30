/*
  Warnings:

  - You are about to drop the column `drawing3DId` on the `MarkerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `drawingBOQId` on the `MarkerGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MarkerGroup" DROP CONSTRAINT "MarkerGroup_drawing3DId_fkey";

-- DropForeignKey
ALTER TABLE "MarkerGroup" DROP CONSTRAINT "MarkerGroup_drawingBOQId_fkey";

-- AlterTable
ALTER TABLE "MarkerGroup" DROP COLUMN "drawing3DId",
DROP COLUMN "drawingBOQId";
