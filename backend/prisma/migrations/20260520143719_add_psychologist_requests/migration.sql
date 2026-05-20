-- CreateEnum
CREATE TYPE "PsychologistRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "psychologist_requests" (
    "id" TEXT NOT NULL,
    "status" "PsychologistRequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "userId" TEXT NOT NULL,
    "psychologistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologist_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "psychologist_requests_userId_idx" ON "psychologist_requests"("userId");

-- CreateIndex
CREATE INDEX "psychologist_requests_psychologistId_idx" ON "psychologist_requests"("psychologistId");

-- CreateIndex
CREATE UNIQUE INDEX "psychologist_requests_userId_psychologistId_key" ON "psychologist_requests"("userId", "psychologistId");

-- AddForeignKey
ALTER TABLE "psychologist_requests" ADD CONSTRAINT "psychologist_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychologist_requests" ADD CONSTRAINT "psychologist_requests_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
