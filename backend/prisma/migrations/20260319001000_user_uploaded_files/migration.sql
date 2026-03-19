-- Add user uploaded files (separate from cvUrl)
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "uploadedFiles" JSONB;

