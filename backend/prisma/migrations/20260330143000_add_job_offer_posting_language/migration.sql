-- Add postingLanguage field to identify the language of each job offer announcement
ALTER TABLE "job_offers"
ADD COLUMN IF NOT EXISTS "postingLanguage" TEXT NOT NULL DEFAULT 'es';
