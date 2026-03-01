const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear admin por defecto
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@jobplatform.com' },
    update: {},
    create: {
      email: 'admin@jobplatform.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Principal',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Crear categorías
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

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✅ ${categories.length} categorías creadas`);

  // Crear usuario de ejemplo
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'juan.perez@example.com' },
    update: {},
    create: {
      email: 'juan.perez@example.com',
      password: userPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+54 9 11 1234-5678',
      title: 'Desarrollador Full Stack',
      bio: 'Desarrollador con 5 años de experiencia en React, Node.js y PostgreSQL',
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
      location: 'Buenos Aires, Argentina',
      experience: [
        {
          company: 'Tech Solutions SA',
          position: 'Desarrollador Full Stack',
          startDate: '2020-01',
          endDate: 'Presente',
          description: 'Desarrollo de aplicaciones web con React y Node.js',
        },
      ],
      education: [
        {
          institution: 'Universidad de Buenos Aires',
          degree: 'Ingeniería en Sistemas',
          startDate: '2015-03',
          endDate: '2019-12',
        },
      ],
    },
  });
  console.log('✅ Usuario de ejemplo creado:', user.email);

  // Crear empresa de ejemplo
  const companyPassword = await bcrypt.hash('company123', 10);
  const company = await prisma.company.upsert({
    where: { email: 'rrhh@techcorp.com' },
    update: {},
    create: {
      email: 'rrhh@techcorp.com',
      password: companyPassword,
      companyName: 'TechCorp Argentina',
      description: 'Empresa líder en desarrollo de software y soluciones tecnológicas',
      website: 'https://techcorp.com.ar',
      location: 'Buenos Aires, Argentina',
      industry: 'Tecnología',
      size: '51-200 empleados',
    },
  });
  console.log('✅ Empresa de ejemplo creada:', company.email);

  // Crear suscripción activa para la empresa
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const subscription = await prisma.subscription.create({
    data: {
      companyId: company.id,
      plan: 'MONTHLY',
      status: 'ACTIVE',
      startDate,
      endDate,
      amount: 9999,
      currency: 'ARS',
      paymentStatus: 'approved',
    },
  });
  console.log('✅ Suscripción creada para:', company.companyName);

  // Crear ofertas de trabajo de ejemplo
  const techCategory = await prisma.category.findUnique({ where: { slug: 'tecnologia' } });
  
  if (techCategory) {
    const jobOffer = await prisma.jobOffer.create({
      data: {
        title: 'Desarrollador Full Stack Senior',
        description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo de desarrollo.',
        requirements: [
          '5+ años de experiencia en desarrollo web',
          'Dominio de React y Node.js',
          'Experiencia con PostgreSQL',
          'Conocimiento de Git y metodologías ágiles',
          'Inglés técnico (lectura)',
        ],
        responsibilities: [
          'Desarrollar y mantener aplicaciones web',
          'Colaborar con el equipo de diseño y producto',
          'Participar en revisiones de código',
          'Mentorear desarrolladores junior',
        ],
        location: 'Buenos Aires, Argentina',
        salaryMin: 150000,
        salaryMax: 250000,
        salaryPeriod: 'monthly',
        workType: 'FULL_TIME',
        workMode: 'HIBRIDO',
        experienceLevel: 'SENIOR',
        whatsappNumber: '+54 9 11 9876-5432',
        contactEmail: 'rrhh@techcorp.com',
        languages: ['Español', 'Inglés'],
        companyId: company.id,
        categoryId: techCategory.id,
        isActive: true,
      },
    });
    console.log('✅ Oferta de trabajo creada:', jobOffer.title);
  }

  console.log('');
  console.log('==========================================');
  console.log('✨ Seed completado exitosamente!');
  console.log('==========================================');
  console.log('📧 Admin:   admin@jobplatform.com / admin123');
  console.log('📧 Usuario: juan.perez@example.com / user123');
  console.log('📧 Empresa: rrhh@techcorp.com / company123');
  console.log('==========================================');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
