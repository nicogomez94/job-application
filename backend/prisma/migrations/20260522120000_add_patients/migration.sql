-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- Preserve existing psychologist requests by turning the previous common users
-- that contacted psychologists into patient accounts.
INSERT INTO "patients" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "phone",
    "profileImage",
    "createdAt",
    "updatedAt"
)
SELECT DISTINCT ON (u."id")
    u."id",
    u."email",
    COALESCE(u."password", ''),
    u."firstName",
    u."lastName",
    u."phone",
    u."profileImage",
    u."createdAt",
    u."updatedAt"
FROM "psychologist_requests" pr
JOIN "users" u ON u."id" = pr."userId"
ON CONFLICT ("email") DO NOTHING;

-- Replace user ownership with patient ownership for psychologist requests.
ALTER TABLE "psychologist_requests" DROP CONSTRAINT "psychologist_requests_userId_fkey";
ALTER TABLE "psychologist_requests" ADD COLUMN "patientId" TEXT;
UPDATE "psychologist_requests" SET "patientId" = "userId";
ALTER TABLE "psychologist_requests" ALTER COLUMN "patientId" SET NOT NULL;

DROP INDEX "psychologist_requests_userId_idx";
DROP INDEX "psychologist_requests_userId_psychologistId_key";
ALTER TABLE "psychologist_requests" DROP COLUMN "userId";

CREATE INDEX "psychologist_requests_patientId_idx" ON "psychologist_requests"("patientId");
CREATE UNIQUE INDEX "psychologist_requests_patientId_psychologistId_key" ON "psychologist_requests"("patientId", "psychologistId");

ALTER TABLE "psychologist_requests" ADD CONSTRAINT "psychologist_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
