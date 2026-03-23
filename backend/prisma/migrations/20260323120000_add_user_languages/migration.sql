-- Add user languages field to store spoken languages in profile
ALTER TABLE "users"
ADD COLUMN "languages" TEXT[];
