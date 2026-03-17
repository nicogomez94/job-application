const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
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

async function main() {
  console.log('🌱 Iniciando seed de categorías...');

  for (const category of categories) {
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

  console.log(`✅ ${categories.length} categorías listas`);
}

main()
  .catch((error) => {
    console.error('❌ Error en seed de categorías:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
