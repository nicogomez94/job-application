-- Add mutual ratings for freelance completed applications
ALTER TABLE "applications"
ADD COLUMN IF NOT EXISTS "ratingByCompany" INTEGER,
ADD COLUMN IF NOT EXISTS "ratingByUser" INTEGER;
