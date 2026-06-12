-- Track legal consent acceptance for patients and psychologists
ALTER TABLE "psychologists"
ADD COLUMN     "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptPrivacy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptAgreement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentMetadata" JSONB;

ALTER TABLE "patients"
ADD COLUMN     "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptPrivacy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptAgreement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentMetadata" JSONB;
