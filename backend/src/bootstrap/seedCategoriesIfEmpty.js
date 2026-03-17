const prisma = require('../config/database');

const DEFAULT_CATEGORIES = [
  { name: 'Tecnología', slug: 'tecnologia', description: 'Empleos en tecnología y desarrollo', icon: '💻' },
  { name: 'Marketing', slug: 'marketing', description: 'Empleos en marketing y publicidad', icon: '📢' },
  { name: 'Ventas', slug: 'ventas', description: 'Empleos en ventas y comercio', icon: '💼' },
  { name: 'Diseño', slug: 'diseno', description: 'Empleos en diseño gráfico y UX/UI', icon: '🎨' },
  { name: 'Recursos Humanos', slug: 'recursos-humanos', description: 'Empleos en RRHH y gestión de personal', icon: '👥' },
  { name: 'Finanzas', slug: 'finanzas', description: 'Empleos en finanzas y contabilidad', icon: '💰' },
  { name: 'Salud', slug: 'salud', description: 'Empleos en salud y medicina', icon: '⚕️' },
  { name: 'Educación', slug: 'educacion', description: 'Empleos en educación y formación', icon: '📚' },
  { name: 'Atención al Cliente', slug: 'atencion-cliente', description: 'Empleos en servicio al cliente', icon: '🎧' },
  { name: 'Administración', slug: 'administracion', description: 'Empleos en administración y gestión', icon: '📋' },
];

async function seedCategoriesIfEmpty() {
  const totalCategories = await prisma.category.count();

  if (totalCategories > 0) {
    console.log(`ℹ️ Categorías existentes: ${totalCategories}. No se requiere seed.`);
    return;
  }

  console.log('🌱 No hay categorías. Cargando categorías por defecto...');

  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
      create: category,
    });
  }

  console.log(`✅ Seed automático completado: ${DEFAULT_CATEGORIES.length} categorías.`);
}

module.exports = seedCategoriesIfEmpty;
