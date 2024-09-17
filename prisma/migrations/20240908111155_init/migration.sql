-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);
