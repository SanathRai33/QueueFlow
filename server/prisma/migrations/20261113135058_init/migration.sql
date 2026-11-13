-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('WAITING', 'SERVING', 'SERVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "tokenCounter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "personName" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'WAITING',
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "servedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueSnapshot" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueueSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE INDEX "Queue_managerId_idx" ON "Queue"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_managerId_name_key" ON "Queue"("managerId", "name");

-- CreateIndex
CREATE INDEX "Token_queueId_status_position_idx" ON "Token"("queueId", "status", "position");

-- CreateIndex
CREATE INDEX "Token_queueId_createdAt_idx" ON "Token"("queueId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Token_queueId_tokenNumber_key" ON "Token"("queueId", "tokenNumber");

-- CreateIndex
CREATE INDEX "QueueSnapshot_queueId_recordedAt_idx" ON "QueueSnapshot"("queueId", "recordedAt");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueSnapshot" ADD CONSTRAINT "QueueSnapshot_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
