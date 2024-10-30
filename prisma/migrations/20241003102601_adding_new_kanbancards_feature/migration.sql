-- CreateTable
CREATE TABLE "Kanban_Cards" (
    "id" SERIAL NOT NULL,
    "column" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Kanban_Cards_pkey" PRIMARY KEY ("id")
);
