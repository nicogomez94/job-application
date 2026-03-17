const prisma = require('../config/database');
const { DEFAULT_CATEGORIES } = require('../constants/defaultCategories');

async function seedCategoriesIfEmpty() {
  console.log('🌱 Sincronizando categorías por defecto...');

  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon || null,
      },
      create: category,
    });
  }

  const allowedSlugs = DEFAULT_CATEGORIES.map((category) => category.slug);
  const staleCategories = await prisma.category.findMany({
    where: {
      slug: { notIn: allowedSlugs },
    },
    include: {
      _count: {
        select: { jobOffers: true },
      },
    },
  });

  let removed = 0;
  let keptWithOffers = 0;

  for (const category of staleCategories) {
    if ((category._count?.jobOffers || 0) > 0) {
      keptWithOffers += 1;
      continue;
    }

    await prisma.category.delete({ where: { id: category.id } });
    removed += 1;
  }

  console.log(`✅ Categorías sincronizadas: ${DEFAULT_CATEGORIES.length} base, ${removed} removidas, ${keptWithOffers} conservadas por tener ofertas.`);
}

module.exports = seedCategoriesIfEmpty;
