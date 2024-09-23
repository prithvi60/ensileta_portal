/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `view2D` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `view3D` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `viewBOQ` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "view2D";

-- DropTable
DROP TABLE "view3D";

-- DropTable
DROP TABLE "viewBOQ";

-- CreateTable
CREATE TABLE "Drawing_2D" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Drawing_2D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drawing_3D" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Drawing_3D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drawing_BOQ" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Drawing_BOQ_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drawing_2D" ADD CONSTRAINT "Drawing_2D_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing_3D" ADD CONSTRAINT "Drawing_3D_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drawing_BOQ" ADD CONSTRAINT "Drawing_BOQ_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
