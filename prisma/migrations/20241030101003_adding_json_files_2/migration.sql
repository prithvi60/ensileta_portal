-- CreateTable
CREATE TABLE "MarkerGroup3D" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drawing3DId" INTEGER,

    CONSTRAINT "MarkerGroup3D_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkerGroupBoq" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drawingBoqId" INTEGER,

    CONSTRAINT "MarkerGroupBoq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarkerGroup3D" ADD CONSTRAINT "MarkerGroup3D_drawing3DId_fkey" FOREIGN KEY ("drawing3DId") REFERENCES "Drawing_3D"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroupBoq" ADD CONSTRAINT "MarkerGroupBoq_drawingBoqId_fkey" FOREIGN KEY ("drawingBoqId") REFERENCES "Drawing_BOQ"("id") ON DELETE SET NULL ON UPDATE CASCADE;
