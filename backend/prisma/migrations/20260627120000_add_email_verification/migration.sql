-- Require email ownership confirmation for every public account type.
ALTER TABLE "users"
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationSentAt" TIMESTAMP(3);

ALTER TABLE "companies"
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationSentAt" TIMESTAMP(3);

ALTER TABLE "patients"
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationSentAt" TIMESTAMP(3);

ALTER TABLE "psychologists"
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationSentAt" TIMESTAMP(3);

-- Google already verifies ownership of the email returned by OAuth.
UPDATE "users"
SET "emailVerified" = true, "emailVerifiedAt" = NOW()
WHERE "googleId" IS NOT NULL;

UPDATE "companies"
SET "emailVerified" = true, "emailVerifiedAt" = NOW()
WHERE "googleId" IS NOT NULL;
