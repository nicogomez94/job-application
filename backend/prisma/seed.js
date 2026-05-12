const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear admin por defecto
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@professionalsathome.com' },
    update: {},
    create: {
      email: 'admin@professionalsathome.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Principal',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Crear categorías
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✅ ${DEFAULT_CATEGORIES.length} categorías creadas`);

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
  const techCategory = await prisma.category.findUnique({ where: { slug: 'ingeniero-software' } });
  
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
        postingLanguage: 'es',
        companyId: company.id,
        categoryId: techCategory.id,
        isActive: true,
      },
    });
    console.log('✅ Oferta de trabajo creada:', jobOffer.title);
  }

  // Crear psicólogos de ejemplo visibles en el listado público
  const psychologistPassword = await bcrypt.hash('psico123', 10);
  const psychologistSeedData = [
    {
      email: 'lucia.fernandez.psico@example.com',
      firstName: 'Lucia',
      lastName: 'Fernandez',
      displayName: 'Lic. Lucia Fernandez',
      registrationType: 'ARGENTINA',
      status: 'ACTIVE',
      dateOfBirth: new Date('1988-04-12'),
      phone: '+54 9 11 5555-1111',
      contactEmail: 'lucia.fernandez.psico@example.com',
      country: 'Argentina',
      practiceProvince: 'Buenos Aires',
      universityDegree: 'Lic. en Psicología',
      graduationYear: 2013,
      universityName: 'Universidad de Buenos Aires',
      licenseNumber: 'MP 45821',
      licenseProvince: 'Buenos Aires',
      specialties: ['Psicología clínica y de la salud', 'Psicología (diversos enfoques)'],
      ageRanges: ['Adultos', 'Adolescentes'],
      yearsExperience: 10,
      languages: ['Español', 'Inglés'],
      remoteModality: 'Telepsicología / Telemedicina',
      bio: 'Acompaño procesos de ansiedad, estrés y vínculos desde un enfoque clínico integrativo.',
      approvedAt: new Date(),
    },
    {
      email: 'camila.rojas.psico@example.com',
      firstName: 'Camila',
      lastName: 'Rojas',
      displayName: 'Camila Rojas',
      registrationType: 'INTERNATIONAL',
      status: 'ACTIVE',
      dateOfBirth: new Date('1991-09-03'),
      phone: '+56 9 6789 1234',
      contactEmail: 'camila.rojas.psico@example.com',
      country: 'Chile',
      region: 'Santiago',
      licenseEntity: 'Colegio de Psicólogos de Chile',
      licenseCountry: 'Chile',
      degreeInstitution: 'Pontificia Universidad Católica de Chile',
      specialties: ['Psicología perinatal y abordaje de ansiedad/depresión en embarazo o posparto'],
      ageRanges: ['Adultos'],
      yearsExperience: 8,
      languages: ['Español'],
      remoteModality: 'Telepsicología / Telemedicina',
      bio: 'Trabajo con adultos y familias en temas de maternidad, ansiedad y regulación emocional.',
      approvedAt: new Date(),
    },
    {
      email: 'mariana.silva.psico@example.com',
      firstName: 'Mariana',
      lastName: 'Silva',
      displayName: 'Dra. Mariana Silva',
      registrationType: 'INTERNATIONAL',
      status: 'ACTIVE',
      dateOfBirth: new Date('1985-11-21'),
      phone: '+55 11 98888 7777',
      contactEmail: 'mariana.silva.psico@example.com',
      country: 'Brasil',
      region: 'São Paulo',
      licenseEntity: 'Conselho Regional de Psicologia',
      licenseCountry: 'Brasil',
      degreeInstitution: 'Universidade de São Paulo',
      specialties: ['Psicología social y comunitaria', 'Psicología del desarrollo y edades'],
      ageRanges: ['Adultos', 'Infanto-juvenil'],
      yearsExperience: 12,
      languages: ['Portugués', 'Español'],
      remoteModality: 'Telepsicología / Telemedicina',
      bio: 'Atiendo adolescentes y adultos con foco en desarrollo personal, comunidad y bienestar emocional.',
      approvedAt: new Date(),
    },
  ];

  for (const psychologistData of psychologistSeedData) {
    const psychologist = await prisma.psychologist.upsert({
      where: { email: psychologistData.email },
      update: {
        ...psychologistData,
        password: psychologistPassword,
      },
      create: {
        ...psychologistData,
        password: psychologistPassword,
      },
    });

    const activeSubscription = await prisma.psychologistSubscription.findFirst({
      where: {
        psychologistId: psychologist.id,
        status: 'ACTIVE',
      },
    });

    if (!activeSubscription) {
      const subscriptionStartDate = new Date();
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      await prisma.psychologistSubscription.create({
        data: {
          psychologistId: psychologist.id,
          plan: 'MONTHLY',
          status: 'ACTIVE',
          startDate: subscriptionStartDate,
          endDate: subscriptionEndDate,
          amount: 29.99,
          currency: 'USD',
          paymentStatus: 'approved',
          paymentMethod: 'seed',
        },
      });
    }
  }
  console.log(`âœ… ${psychologistSeedData.length} psicólogos de ejemplo creados`);

  console.log('');
  console.log('==========================================');
  console.log('✨ Seed completado exitosamente!');
  console.log('==========================================');
  console.log('📧 Admin:   admin@professionalsathome.com / admin123');
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
