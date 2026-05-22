-- CreateEnum
CREATE TYPE "PsychologistPatientBlockedBy" AS ENUM ('PATIENT', 'PSYCHOLOGIST');

-- CreateTable
CREATE TABLE "psychologist_patient_blocks" (
    "id" TEXT NOT NULL,
    "blockedBy" "PsychologistPatientBlockedBy" NOT NULL,
    "patientId" TEXT NOT NULL,
    "psychologistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologist_patient_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psychologist_patient_blocks_patientId_psychologistId_key" ON "psychologist_patient_blocks"("patientId", "psychologistId");

-- CreateIndex
CREATE INDEX "psychologist_patient_blocks_patientId_idx" ON "psychologist_patient_blocks"("patientId");

-- CreateIndex
CREATE INDEX "psychologist_patient_blocks_psychologistId_idx" ON "psychologist_patient_blocks"("psychologistId");

-- AddForeignKey
ALTER TABLE "psychologist_patient_blocks" ADD CONSTRAINT "psychologist_patient_blocks_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychologist_patient_blocks" ADD CONSTRAINT "psychologist_patient_blocks_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
