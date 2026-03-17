require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ==================== VALIDACIÓN DE ENV VARS ====================
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('❌ Faltan las siguientes variables de entorno requeridas:', missingEnv.join(', '));
  process.exit(1);
}

const passport = require('./config/passport');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARES ====================

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== RUTAS ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Job Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Job Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      companies: '/api/companies',
      jobOffers: '/api/job-offers',
      applications: '/api/applications',
      admin: '/api/admin',
      subscriptions: '/api/subscriptions',
      categories: '/api/categories',
    },
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// ==================== ERROR HANDLER ====================

app.use(errorHandler);

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('==========================================');
  console.log('🚀 Job Platform API');
  console.log('==========================================');
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación en http://localhost:${PORT}/api/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('==========================================');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
