const prisma = require('../config/database');

const ALTER_SQL = `
  ALTER TABLE "job_offers"
  ADD COLUMN IF NOT EXISTS "postingLanguage" TEXT NOT NULL DEFAULT 'es'
`;

const VERIFY_SQL = `
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'job_offers'
    AND column_name = 'postingLanguage'
  LIMIT 1
`;

async function ensureJobOfferPostingLanguageColumn() {
  try {
    await prisma.$executeRawUnsafe(ALTER_SQL);
    const result = await prisma.$queryRawUnsafe(VERIFY_SQL);

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error('No se pudo verificar la columna postingLanguage en job_offers');
    }

    console.log('✅ Columna job_offers.postingLanguage verificada');
  } catch (error) {
    const message = error?.message || String(error);
    console.error('⚠️ No se pudo asegurar la columna job_offers.postingLanguage:', message);
    throw error;
  }
}

module.exports = ensureJobOfferPostingLanguageColumn;
