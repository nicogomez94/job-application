ALTER TABLE "psychologist_requests"
ADD COLUMN IF NOT EXISTS "terminationRequestedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "terminationAcceptedAt" TIMESTAMP(3);
