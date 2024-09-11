-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT;

-- CreateTable
CREATE TABLE "accessControl" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "accessControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accessControl_email_key" ON "accessControl"("email");
