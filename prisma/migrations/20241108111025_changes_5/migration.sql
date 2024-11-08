-- CreateTable
CREATE TABLE "Drawing_AB" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "approve" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Drawing_AB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkerGroupAB" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drawingAbId" INTEGER NOT NULL,

    CONSTRAINT "MarkerGroupAB_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drawing_AB" ADD CONSTRAINT "Drawing_AB_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroupAB" ADD CONSTRAINT "MarkerGroupAB_drawingAbId_fkey" FOREIGN KEY ("drawingAbId") REFERENCES "Drawing_AB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
