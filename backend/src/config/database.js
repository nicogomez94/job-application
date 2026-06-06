const { PrismaClient } = require('@prisma/client');

const enablePrismaQueryLog = ['true', '1', 'yes'].includes(
  String(process.env.PRISMA_QUERY_LOG || '').toLowerCase()
);

const prisma = new PrismaClient({
  log: enablePrismaQueryLog ? ['query', 'error', 'warn'] : ['error'],
});

// Manejo de conexión
prisma.$connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
  })
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  });

// Cerrar conexión al terminar la aplicación
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
