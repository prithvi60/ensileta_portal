/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "files";

-- CreateTable
CREATE TABLE "view2D" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileURL" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "view2D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "view3D" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileURL" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "view3D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewBOQ" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileURL" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viewBOQ_pkey" PRIMARY KEY ("id")
);
