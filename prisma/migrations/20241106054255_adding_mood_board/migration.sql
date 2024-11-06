/*
  Warnings:

  - You are about to drop the `Marker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarkerGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Marker" DROP CONSTRAINT "Marker_markerGroupId_fkey";

-- DropForeignKey
ALTER TABLE "MarkerGroup" DROP CONSTRAINT "MarkerGroup_drawing2DId_fkey";

-- DropTable
DROP TABLE "Marker";

-- DropTable
DROP TABLE "MarkerGroup";

-- CreateTable
CREATE TABLE "Drawing_MB" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Drawing_MB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkerGroupMB" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drawingMbId" INTEGER,

    CONSTRAINT "MarkerGroupMB_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drawing_MB" ADD CONSTRAINT "Drawing_MB_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroupMB" ADD CONSTRAINT "MarkerGroupMB_drawingMbId_fkey" FOREIGN KEY ("drawingMbId") REFERENCES "Drawing_MB"("id") ON DELETE SET NULL ON UPDATE CASCADE;
