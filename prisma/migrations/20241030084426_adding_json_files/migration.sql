-- CreateTable
CREATE TABLE "MarkerGroup2D" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drawing2DId" INTEGER,

    CONSTRAINT "MarkerGroup2D_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarkerGroup2D" ADD CONSTRAINT "MarkerGroup2D_drawing2DId_fkey" FOREIGN KEY ("drawing2DId") REFERENCES "Drawing_2D"("id") ON DELETE SET NULL ON UPDATE CASCADE;
