/*
  Warnings:

  - Made the column `drawing2DId` on table `MarkerGroup2D` required. This step will fail if there are existing NULL values in that column.
  - Made the column `drawing3DId` on table `MarkerGroup3D` required. This step will fail if there are existing NULL values in that column.
  - Made the column `drawingBoqId` on table `MarkerGroupBoq` required. This step will fail if there are existing NULL values in that column.
  - Made the column `drawingMbId` on table `MarkerGroupMB` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MarkerGroup2D" DROP CONSTRAINT "MarkerGroup2D_drawing2DId_fkey";

-- DropForeignKey
ALTER TABLE "MarkerGroup3D" DROP CONSTRAINT "MarkerGroup3D_drawing3DId_fkey";

-- DropForeignKey
ALTER TABLE "MarkerGroupBoq" DROP CONSTRAINT "MarkerGroupBoq_drawingBoqId_fkey";

-- DropForeignKey
ALTER TABLE "MarkerGroupMB" DROP CONSTRAINT "MarkerGroupMB_drawingMbId_fkey";

-- AlterTable
ALTER TABLE "MarkerGroup2D" ALTER COLUMN "drawing2DId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MarkerGroup3D" ALTER COLUMN "drawing3DId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MarkerGroupBoq" ALTER COLUMN "drawingBoqId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MarkerGroupMB" ALTER COLUMN "drawingMbId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MarkerGroup2D" ADD CONSTRAINT "MarkerGroup2D_drawing2DId_fkey" FOREIGN KEY ("drawing2DId") REFERENCES "Drawing_2D"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroupMB" ADD CONSTRAINT "MarkerGroupMB_drawingMbId_fkey" FOREIGN KEY ("drawingMbId") REFERENCES "Drawing_MB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroup3D" ADD CONSTRAINT "MarkerGroup3D_drawing3DId_fkey" FOREIGN KEY ("drawing3DId") REFERENCES "Drawing_3D"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroupBoq" ADD CONSTRAINT "MarkerGroupBoq_drawingBoqId_fkey" FOREIGN KEY ("drawingBoqId") REFERENCES "Drawing_BOQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
