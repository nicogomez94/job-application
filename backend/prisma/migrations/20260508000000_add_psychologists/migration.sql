-- CreateEnum
CREATE TYPE "PsychologistStatus" AS ENUM ('PENDING_DOCS', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('ARGENTINA', 'INTERNATIONAL');

-- CreateTable
CREATE TABLE "psychologists" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationType" "RegistrationType" NOT NULL,
    "status" "PsychologistStatus" NOT NULL DEFAULT 'PENDING_DOCS',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "phone" TEXT,
    "contactEmail" TEXT,
    "profileImage" TEXT,
    "dni" TEXT,
    "cuitCuil" TEXT,
    "addressStreet" TEXT,
    "addressNumber" TEXT,
    "addressFloor" TEXT,
    "addressCity" TEXT,
    "addressProvince" TEXT,
    "addressPostalCode" TEXT,
    "practiceProvince" TEXT,
    "universityDegree" TEXT,
    "graduationYear" INTEGER,
    "universityName" TEXT,
    "licenseNumber" TEXT,
    "licenseProvince" TEXT,
    "healthMinistryReg" TEXT,
    "documentType" TEXT,
    "documentNumber" TEXT,
    "taxId" TEXT,
    "country" TEXT,
    "region" TEXT,
    "licenseEntity" TEXT,
    "licenseCountry" TEXT,
    "degreeInstitution" TEXT,
    "specialties" TEXT[],
    "ageRanges" TEXT[],
    "yearsExperience" INTEGER,
    "languages" TEXT[],
    "remoteModality" TEXT,
    "bio" TEXT,
    "displayName" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psychologist_documents" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "originalName" TEXT,
    "psychologistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "psychologist_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psychologist_subscriptions" (
    "id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'MONTHLY',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentId" TEXT,
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "psychologistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologist_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psychologists_email_key" ON "psychologists"("email");

-- CreateIndex
CREATE INDEX "psychologists_status_idx" ON "psychologists"("status");

-- CreateIndex
CREATE INDEX "psychologists_country_idx" ON "psychologists"("country");

-- CreateIndex
CREATE INDEX "psychologist_documents_psychologistId_idx" ON "psychologist_documents"("psychologistId");

-- CreateIndex
CREATE UNIQUE INDEX "psychologist_subscriptions_paymentId_key" ON "psychologist_subscriptions"("paymentId");

-- CreateIndex
CREATE INDEX "psychologist_subscriptions_psychologistId_idx" ON "psychologist_subscriptions"("psychologistId");

-- CreateIndex
CREATE INDEX "psychologist_subscriptions_status_idx" ON "psychologist_subscriptions"("status");

-- AddForeignKey
ALTER TABLE "psychologist_documents" ADD CONSTRAINT "psychologist_documents_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychologist_subscriptions" ADD CONSTRAINT "psychologist_subscriptions_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "psychologists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
