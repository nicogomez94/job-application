const envFlag = String(import.meta.env.VITE_DEBUG_MODE || '').toLowerCase();

export const DEBUG_MODE = envFlag === 'true' || envFlag === '1';

export const DEBUG_FORM_DATA = {
  loginByType: {
    user: {
      email: 'juan.perez@example.com',
      password: 'debug123',
    },
    company: {
      email: 'rrhh@techcorp.com',
      password: 'company123',
    },
    admin: {
      email: 'admin@jobplatform.com',
      password: 'admin123',
    },
  },
  registerUser: {
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@example.com',
    password: 'debug123',
    confirmPassword: 'debug123',
    phone: '+54 11 1234 5678',
    cv: null,
  },
  registerCompany: {
    companyName: 'Empresa Debug SA',
    email: 'empresa.debug@example.com',
    password: 'debug123',
    confirmPassword: 'debug123',
    website: 'https://empresa-debug.com',
    industry: 'Tecnologia',
    size: '51-200',
    location: 'Buenos Aires',
    description: 'Empresa de prueba para modo debug.',
    logo: null,
  },
  createJob: {
    title: 'Desarrollador Frontend React',
    description: 'Buscamos frontend developer con experiencia en React y testing.',
    location: 'Capital Federal',
    categoryId: '',
    postingLanguage: 'es',
    requirementsText: 'React\nJavaScript\nGit',
    responsibilitiesText: 'Desarrollar features\nMantener codigo\nCode reviews',
    languagesText: 'Espanol, Ingles',
    salaryMin: '1200000',
    salaryMax: '1800000',
    salaryPeriod: 'monthly',
    workType: 'FULL_TIME',
    workMode: 'REMOTO',
    experienceLevel: 'MID',
    whatsappNumber: '+54 11 5555 5555',
    contactEmail: 'rrhh@empresa-debug.com',
    expiresAt: '2026-12-31',
  },
};

export const getDebugLoginData = (userType = 'user') =>
  DEBUG_FORM_DATA.loginByType[userType] || DEBUG_FORM_DATA.loginByType.user;
