const { PrismaClient } = require('@prisma/client');
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de categorías...');

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

  console.log(`✅ ${DEFAULT_CATEGORIES.length} categorías listas`);
}

main()
  .catch((error) => {
    console.error('❌ Error en seed de categorías:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
