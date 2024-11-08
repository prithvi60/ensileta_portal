-- AlterTable
ALTER TABLE "Drawing_2D" ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Drawing_3D" ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Drawing_BOQ" ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Drawing_MB" ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "accessControl" ADD COLUMN     "phone_number" TEXT;
