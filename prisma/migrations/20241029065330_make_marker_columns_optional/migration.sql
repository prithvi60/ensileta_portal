-- CreateTable
CREATE TABLE "Marker" (
    "id" SERIAL NOT NULL,
    "top" DOUBLE PRECISION NOT NULL,
    "left" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "markerGroupId" INTEGER NOT NULL,

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkerGroup" (
    "id" SERIAL NOT NULL,
    "drawing2DId" INTEGER,
    "drawing3DId" INTEGER,
    "drawingBOQId" INTEGER,

    CONSTRAINT "MarkerGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marker" ADD CONSTRAINT "Marker_markerGroupId_fkey" FOREIGN KEY ("markerGroupId") REFERENCES "MarkerGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroup" ADD CONSTRAINT "MarkerGroup_drawing2DId_fkey" FOREIGN KEY ("drawing2DId") REFERENCES "Drawing_2D"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroup" ADD CONSTRAINT "MarkerGroup_drawing3DId_fkey" FOREIGN KEY ("drawing3DId") REFERENCES "Drawing_3D"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkerGroup" ADD CONSTRAINT "MarkerGroup_drawingBOQId_fkey" FOREIGN KEY ("drawingBOQId") REFERENCES "Drawing_BOQ"("id") ON DELETE SET NULL ON UPDATE CASCADE;
