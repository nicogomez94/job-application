import api from './api';
import { repairMojibakeDeep } from '../utils/textEncoding';
import { DEBUG_API_MODE, DEBUG_FORM_DATA } from '../config/debug';

const clone = (value) => JSON.parse(JSON.stringify(value));
const debugResponse = (data) => Promise.resolve({ data: clone(data) });

const getStoredUser = (userType) => {
  if (!DEBUG_API_MODE || typeof window === 'undefined') return null;
  try {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType !== userType) return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredUser = (updater) => {
  if (!DEBUG_API_MODE || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    const current = raw ? JSON.parse(raw) : null;
    if (!current) return null;
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    localStorage.setItem('user', JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
};

const basePsychologistProfile = {
  id: 'psy-debug-lucia',
  firstName: DEBUG_FORM_DATA.registerPsychologistAR.firstName,
  lastName: DEBUG_FORM_DATA.registerPsychologistAR.lastName,
  displayName: 'Dra. Lucia Fernandez',
  email: DEBUG_FORM_DATA.registerPsychologistAR.email,
  phone: DEBUG_FORM_DATA.registerPsychologistAR.phone,
  contactEmail: DEBUG_FORM_DATA.registerPsychologistAR.contactEmail,
  gender: DEBUG_FORM_DATA.registerPsychologistAR.gender,
  dateOfBirth: DEBUG_FORM_DATA.registerPsychologistAR.dateOfBirth,
  country: 'Argentina',
  region: DEBUG_FORM_DATA.registerPsychologistAR.addressProvince,
  practiceProvince: DEBUG_FORM_DATA.registerPsychologistAR.practiceProvince,
  universityDegree: DEBUG_FORM_DATA.registerPsychologistAR.universityDegree,
  degreeInstitution: DEBUG_FORM_DATA.registerPsychologistAR.universityName,
  licenseNumber: DEBUG_FORM_DATA.registerPsychologistAR.licenseNumber,
  licenseProvince: DEBUG_FORM_DATA.registerPsychologistAR.licenseProvince,
  healthMinistryReg: DEBUG_FORM_DATA.registerPsychologistAR.healthMinistryReg,
  virtualConsultingAuthorization: DEBUG_FORM_DATA.registerPsychologistAR.virtualConsultingAuthorization,
  sessionCost: DEBUG_FORM_DATA.registerPsychologistAR.sessionCost,
  sessionDuration: DEBUG_FORM_DATA.registerPsychologistAR.sessionDuration,
  yearsExperience: Number(DEBUG_FORM_DATA.registerPsychologistAR.yearsExperience),
  remoteModality: DEBUG_FORM_DATA.registerPsychologistAR.remoteModality,
  bio: DEBUG_FORM_DATA.registerPsychologistAR.bio,
  languages: clone(DEBUG_FORM_DATA.registerPsychologistAR.languages),
  specialties: clone(DEBUG_FORM_DATA.registerPsychologistAR.specialties),
  ageRanges: clone(DEBUG_FORM_DATA.registerPsychologistAR.ageRanges),
  status: 'APPROVED',
  registrationType: 'ARGENTINA',
  profileImage: '',
};

const publicPsychologistFixtures = [
  basePsychologistProfile,
  {
    id: 'psy-debug-sofia',
    firstName: 'Sofia',
    lastName: 'Martins',
    displayName: 'Dra. Sofia Martins',
    email: DEBUG_FORM_DATA.registerPsychologistINTL.email,
    phone: DEBUG_FORM_DATA.registerPsychologistINTL.phone,
    contactEmail: DEBUG_FORM_DATA.registerPsychologistINTL.contactEmail,
    gender: DEBUG_FORM_DATA.registerPsychologistINTL.gender,
    dateOfBirth: DEBUG_FORM_DATA.registerPsychologistINTL.dateOfBirth,
    country: DEBUG_FORM_DATA.registerPsychologistINTL.country,
    region: DEBUG_FORM_DATA.registerPsychologistINTL.region,
    practiceProvince: DEBUG_FORM_DATA.registerPsychologistINTL.region,
    universityDegree: DEBUG_FORM_DATA.registerPsychologistINTL.universityDegree,
    degreeInstitution: DEBUG_FORM_DATA.registerPsychologistINTL.degreeInstitution,
    licenseNumber: DEBUG_FORM_DATA.registerPsychologistINTL.licenseNumber,
    licenseEntity: DEBUG_FORM_DATA.registerPsychologistINTL.licenseEntity,
    licenseCountry: DEBUG_FORM_DATA.registerPsychologistINTL.licenseCountry,
    sessionCost: DEBUG_FORM_DATA.registerPsychologistINTL.sessionCost,
    sessionDuration: DEBUG_FORM_DATA.registerPsychologistINTL.sessionDuration,
    yearsExperience: Number(DEBUG_FORM_DATA.registerPsychologistINTL.yearsExperience),
    remoteModality: DEBUG_FORM_DATA.registerPsychologistINTL.remoteModality,
    bio: DEBUG_FORM_DATA.registerPsychologistINTL.bio,
    languages: clone(DEBUG_FORM_DATA.registerPsychologistINTL.languages),
    specialties: clone(DEBUG_FORM_DATA.registerPsychologistINTL.specialties),
    ageRanges: clone(DEBUG_FORM_DATA.registerPsychologistINTL.ageRanges),
    status: 'APPROVED',
    registrationType: 'INTERNATIONAL',
    profileImage: '',
  },
  {
    id: 'psy-debug-gabriela',
    firstName: 'Gabriela',
    lastName: 'Torres',
    displayName: 'Dra. Gabriela Torres',
    email: 'gabriela.torres.debug@example.com',
    phone: '+52 55 4444 2222',
    contactEmail: 'gabriela.torres.consultorio@example.com',
    gender: 'Mujer',
    country: 'México',
    region: 'Ciudad de México',
    practiceProvince: 'Ciudad de México',
    universityDegree: 'Lic. en Psicología',
    degreeInstitution: 'Universidad Nacional Autónoma de México',
    licenseNumber: 'MX-PSI-3344',
    sessionCost: 'MXN 850',
    sessionDuration: '50 minutos',
    yearsExperience: 14,
    remoteModality: 'Telepsicología / Telemedicina',
    bio: 'Psicóloga social con foco en acompañamiento de adultos y mayores.',
    languages: ['Español'],
    specialties: ['Psicología social y comunitaria'],
    ageRanges: ['Adultos', 'Adultos mayores'],
    status: 'APPROVED',
    registrationType: 'INTERNATIONAL',
    profileImage: '',
  },
];

const debugPlans = {
  plans: [
    {
      id: 'MONTHLY',
      name: 'Plan 3 meses',
      price: 30000,
      currency: 'ARS',
      duration: 'mes',
      discount: 'Sin cargo en debug',
      features: ['Perfil visible para pacientes', 'Consultas ilimitadas'],
    },
    {
      id: 'QUARTERLY',
      name: 'Plan 7 meses',
      price: 70000,
      currency: 'ARS',
      duration: 'mes',
      discount: 'Recomendado',
      features: ['Más visibilidad', 'Mayor continuidad'],
    },
    {
      id: 'ANNUAL',
      name: 'Plan 12 + 1',
      price: 120000,
      currency: 'ARS',
      duration: 'mes',
      discount: 'Incluye un mes bonificado',
      features: ['Mejor costo anual', 'Perfil destacado'],
    },
  ],
};

const debugSubscriptionState = {
  hasActiveSubscription: false,
  subscription: null,
};

const patientDebugProfile = {
  id: 'pat-debug-carlos',
  firstName: DEBUG_FORM_DATA.registerPatient.firstName,
  lastName: DEBUG_FORM_DATA.registerPatient.lastName,
  email: DEBUG_FORM_DATA.registerPatient.email,
  phone: '+54 11 9999 0000',
  gender: DEBUG_FORM_DATA.registerPatient.gender,
  profileImage: '',
};

const debugRelationships = [
  {
    id: 'req-debug-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'PENDING',
    message: 'Quisiera comenzar un proceso terapéutico por ansiedad.',
    patient: {
      id: patientDebugProfile.id,
      firstName: patientDebugProfile.firstName,
      lastName: patientDebugProfile.lastName,
      profileImage: patientDebugProfile.profileImage,
    },
    psychologist: {
      id: basePsychologistProfile.id,
      firstName: basePsychologistProfile.firstName,
      lastName: basePsychologistProfile.lastName,
      displayName: basePsychologistProfile.displayName,
      phone: basePsychologistProfile.phone,
      contactEmail: basePsychologistProfile.contactEmail,
      specialties: clone(basePsychologistProfile.specialties),
      profileImage: basePsychologistProfile.profileImage,
    },
    blockInfo: null,
    terminationRequestedAt: null,
    terminationAcceptedAt: null,
  },
  {
    id: 'req-debug-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: 'ACCEPTED',
    message: 'Busco seguimiento online.',
    patient: {
      id: 'pat-debug-ana',
      firstName: 'Ana',
      lastName: 'Morales',
      profileImage: '',
    },
    psychologist: {
      id: basePsychologistProfile.id,
      firstName: basePsychologistProfile.firstName,
      lastName: basePsychologistProfile.lastName,
      displayName: basePsychologistProfile.displayName,
      phone: basePsychologistProfile.phone,
      contactEmail: basePsychologistProfile.contactEmail,
      specialties: clone(basePsychologistProfile.specialties),
      profileImage: basePsychologistProfile.profileImage,
    },
    blockInfo: null,
    terminationRequestedAt: null,
    terminationAcceptedAt: null,
  },
  {
    id: 'req-debug-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'REJECTED',
    message: 'Consulta general',
    patient: {
      id: 'pat-debug-bruno',
      firstName: 'Bruno',
      lastName: 'Perez',
      profileImage: '',
    },
    psychologist: {
      id: 'psy-debug-sofia',
      firstName: 'Sofia',
      lastName: 'Martins',
      displayName: 'Dra. Sofia Martins',
      phone: DEBUG_FORM_DATA.registerPsychologistINTL.phone,
      contactEmail: DEBUG_FORM_DATA.registerPsychologistINTL.contactEmail,
      specialties: clone(DEBUG_FORM_DATA.registerPsychologistINTL.specialties),
      profileImage: '',
    },
    blockInfo: null,
    terminationRequestedAt: null,
    terminationAcceptedAt: null,
  },
];

const getDebugProfile = () => {
  const stored = getStoredUser('psychologist');
  const candidate = stored?.id
    ? publicPsychologistFixtures.find((p) => p.id === stored.id) || basePsychologistProfile
    : basePsychologistProfile;
  return {
    ...clone(candidate),
    ...(stored || {}),
    status: stored?.status || candidate.status,
    profileImage: stored?.profileImage ?? candidate.profileImage,
  };
};

const getDebugPatient = () => {
  const stored = getStoredUser('patient');
  return {
    ...clone(patientDebugProfile),
    ...(stored || {}),
  };
};

const setDebugProfile = (nextProfile) => {
  const normalized = clone(nextProfile);
  saveStoredUser((current) => ({ ...current, ...normalized }));
  return normalized;
};

const setDebugSubscription = (subscription) => {
  debugSubscriptionState.hasActiveSubscription = Boolean(subscription);
  debugSubscriptionState.subscription = subscription ? clone(subscription) : null;
  if (subscription?.plan) {
    setDebugProfile({ status: 'ACTIVE' });
  }
  return debugResponse(debugSubscriptionState);
};

const getDebugPublicPsychologists = () => {
  const current = getDebugProfile();
  const merged = [current, ...publicPsychologistFixtures.filter((p) => p.id !== current.id)];
  return merged;
};

const filterDebugPsychologists = (params = {}) => {
  const search = String(params.search || '').trim().toLowerCase();
  const language = String(params.language || '').trim().toLowerCase();
  const country = String(params.country || '').trim().toLowerCase();
  return getDebugPublicPsychologists().filter((psychologist) => {
    const haystack = [
      psychologist.firstName,
      psychologist.lastName,
      psychologist.displayName,
      psychologist.country,
      psychologist.region,
      psychologist.practiceProvince,
      psychologist.licenseNumber,
      psychologist.universityDegree,
      ...(psychologist.languages || []),
      ...(psychologist.specialties || []),
    ].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesLanguage = !language || (psychologist.languages || []).some((l) => String(l).toLowerCase() === language);
    const matchesCountry = !country || String(psychologist.country || '').toLowerCase() === country;
    return matchesSearch && matchesLanguage && matchesCountry;
  });
};

const paginateDebug = (items, params = {}) => {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Number(params.limit || 12));
  const start = (page - 1) * limit;
  return {
    psychologists: items.slice(start, start + limit).map((item) => clone(item)),
    total: items.length,
    page,
    limit,
  };
};

const getDebugRequestContext = (role) => {
  const currentPsychologist = getDebugProfile();
  const currentPatient = getDebugPatient();
  if (role === 'psychologist') {
    return debugRelationships.filter((req) => req.psychologist?.id === currentPsychologist.id);
  }
  if (role === 'patient') {
    return debugRelationships.filter((req) => req.patient?.id === currentPatient.id);
  }
  return debugRelationships;
};

const upsertDebugRelationship = (nextRequest) => {
  const idx = debugRelationships.findIndex((req) => req.id === nextRequest.id);
  if (idx >= 0) {
    debugRelationships[idx] = clone(nextRequest);
  } else {
    debugRelationships.unshift(clone(nextRequest));
  }
};

// ==================== AUTH ====================

export const authService = {
  // Usuarios
  registerUser: (data) => api.post('/auth/user/register', data),
  loginUser: (data) => api.post('/auth/user/login', data),
  requestPasswordRecovery: (data) => api.post('/auth/recover-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // Empresas
  registerCompany: (data) => api.post('/auth/company/register', data),
  loginCompany: (data) => api.post('/auth/company/login', data),

  // Admin
  loginAdmin: (data) => api.post('/auth/admin/login', data),

  // Perfil
  getProfile: (token) =>
    api.get('/auth/profile', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};

// ==================== USERS ====================

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadCV: (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    return api.post('/users/upload/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteCV: () => api.delete('/users/upload/cv'),
  uploadOtherFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/users/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteOtherFile: (index) => api.delete(`/users/upload/file/${index}`),
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    return api.post('/users/upload/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyApplications: () => api.get('/users/applications'),
  deleteAccount: (token) =>
    api.delete('/users/account', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};

// ==================== COMPANIES ====================

export const companyService = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('companyLogo', file);
    return api.post('/companies/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  checkSubscription: () => api.get('/companies/subscription/status'),
  getSubscriptionHistory: () => api.get('/companies/subscription/history'),
  deleteAccount: () => api.delete('/companies/account'),
};

// ==================== JOB OFFERS ====================

export const jobOfferService = {
  search: (params) => api.get('/job-offers/search', { params }),
  getById: (id) => api.get(`/job-offers/${id}`),
  create: (data) => api.post('/job-offers', data),
  getMyOffers: () => api.get('/job-offers/company/my-offers'),
  update: (id, data) => api.put(`/job-offers/${id}`, data),
  updateStatus: (id, isActive) => api.put(`/job-offers/${id}/status`, { isActive }),
  delete: (id) => api.delete(`/job-offers/${id}`),
  getApplicants: (id) => api.get(`/job-offers/${id}/applicants`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/job-offers/applications/${applicationId}/status`, { status }),
  rateApplication: (applicationId, rating) =>
    api.put(`/job-offers/applications/${applicationId}/rating`, { rating }),
};

// ==================== APPLICATIONS ====================

export const applicationService = {
  apply: (jobOfferId, coverLetter) =>
    api.post(`/applications/${jobOfferId}/apply`, { coverLetter }),
  getById: (id) => api.get(`/applications/${id}`),
  cancel: (id) => api.delete(`/applications/${id}`),
  updateCoverLetter: (id, coverLetter) =>
    api.put(`/applications/${id}/cover-letter`, { coverLetter }),
  rateCompany: (id, rating) =>
    api.put(`/applications/${id}/rating`, { rating }),
};

// ==================== SUBSCRIPTIONS ====================

export const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans'),
  create: (data) => api.post('/subscriptions', data),
  getActive: () => api.get('/subscriptions/active'),
  getHistory: () => api.get('/subscriptions/history'),
  cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
};

// ==================== CATEGORIES ====================

export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ==================== ADMIN ====================

export const adminService = {
  getDashboardMetrics: () => api.get('/admin/dashboard/metrics'),
  
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Patients (psychology section)
  getAllPatients: (params) => api.get('/admin/patients', { params }),
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
  
  // Companies
  getAllCompanies: (params) => api.get('/admin/companies', { params }),
  getCompanyById: (id) => api.get(`/admin/companies/${id}`),
  toggleCompanyBlock: (id, isBlocked) =>
    api.put(`/admin/companies/${id}/block`, { isBlocked }),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  
  // Subscriptions
  getAllSubscriptions: (params) => api.get('/admin/subscriptions', { params }),
  
  // Job Offers
  getAllJobOffers: (params) => api.get('/admin/job-offers', { params }),
  deleteJobOffer: (id) => api.delete(`/admin/job-offers/${id}`),
  
  // Admins
  createAdmin: (data) => api.post('/admin/admins', data),

  // Psychologists
  listPsychologists: (params) => api.get('/admin/psychologists', { params }),
  approvePsychologist: (id) => api.post(`/admin/psychologists/${id}/approve`),
  rejectPsychologist: (id, reason) => api.post(`/admin/psychologists/${id}/reject`, { reason }),
  deletePsychologist: (id) => api.delete(`/admin/psychologists/${id}`),
};

// ==================== PSYCHOLOGISTS ====================

export const psychologistAuthService = {
  register: async (data) => {
    if (DEBUG_API_MODE) {
      const isIntl = data.registrationType === 'INTERNATIONAL';
      const source = isIntl ? DEBUG_FORM_DATA.registerPsychologistINTL : DEBUG_FORM_DATA.registerPsychologistAR;
      const psychologist = {
        ...clone(basePsychologistProfile),
        ...(isIntl ? clone(publicPsychologistFixtures[1]) : clone(basePsychologistProfile)),
        id: basePsychologistProfile.id,
        firstName: data.firstName || source.firstName,
        lastName: data.lastName || source.lastName,
        displayName: `Dra. ${data.firstName || source.firstName} ${data.lastName || source.lastName}`,
        email: data.email || source.email,
        status: 'PENDING_DOCS',
        registrationType: data.registrationType || 'ARGENTINA',
      };
      setDebugProfile(psychologist);
      return debugResponse({
        psychologist,
        token: `debug-psych-token-${psychologist.id}`,
      });
    }
    const response = await api.post('/psychologists/auth/register', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  login: async (data) => {
    if (DEBUG_API_MODE) {
      const storedProfile = getDebugProfile();
      const psychologist = {
        ...storedProfile,
        email: data.email || storedProfile.email,
      };
      return debugResponse({
        psychologist,
        token: `debug-psych-token-${psychologist.id}`,
      });
    }
    const response = await api.post('/psychologists/auth/login', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
};

export const patientAuthService = {
  register: async (data) => {
    if (DEBUG_API_MODE) {
      const patient = {
        ...clone(patientDebugProfile),
        id: patientDebugProfile.id,
        firstName: data.firstName || patientDebugProfile.firstName,
        lastName: data.lastName || patientDebugProfile.lastName,
        email: data.email || patientDebugProfile.email,
        phone: data.phone || patientDebugProfile.phone,
        gender: data.gender || patientDebugProfile.gender,
      };
      saveStoredUser(() => patient);
      return debugResponse({
        patient,
        token: `debug-patient-token-${patient.id}`,
      });
    }
    const response = await api.post('/psychologists/patients/auth/register', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  login: async (data) => {
    if (DEBUG_API_MODE) {
      const patient = {
        ...clone(patientDebugProfile),
        email: data.email || patientDebugProfile.email,
      };
      saveStoredUser(() => patient);
      return debugResponse({
        patient,
        token: `debug-patient-token-${patient.id}`,
      });
    }
    const response = await api.post('/psychologists/patients/auth/login', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  uploadProfileImage: (file) => {
    if (DEBUG_API_MODE) {
      return debugResponse({ profileImage: file ? '/debug/patient-profile.png' : '' });
    }
    const formData = new FormData();
    formData.append('patientProfile', file);
    return api.post('/psychologists/patients/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAccount: () => {
    if (DEBUG_API_MODE) return debugResponse({ ok: true });
    return api.delete('/psychologists/patients/me/account');
  },
};

export const psychologistService = {
  // Public
  list: async (params) => {
    if (DEBUG_API_MODE) {
      return debugResponse(paginateDebug(filterDebugPsychologists(params), params));
    }
    const response = await api.get('/psychologists', { params });
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  getById: async (id) => {
    if (DEBUG_API_MODE) {
      const current = getDebugPublicPsychologists().find((p) => String(p.id) === String(id)) || getDebugProfile();
      return debugResponse(current);
    }
    const response = await api.get(`/psychologists/${id}`);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  getPlans: async () => {
    if (DEBUG_API_MODE) {
      return debugResponse(debugPlans);
    }
    const response = await api.get('/psychologists/plans');
    return { ...response, data: repairMojibakeDeep(response.data) };
  },

  // Authenticated psychologist
  getProfile: async () => {
    if (DEBUG_API_MODE) {
      return debugResponse(getDebugProfile());
    }
    const response = await api.get('/psychologists/me/profile');
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  updateProfile: async (data) => {
    if (DEBUG_API_MODE) {
      const current = getDebugProfile();
      const updated = {
        ...current,
        ...clone(data),
        yearsExperience: data.yearsExperience !== undefined && data.yearsExperience !== ''
          ? Number(data.yearsExperience)
          : current.yearsExperience,
      };
      const normalized = setDebugProfile(updated);
      return debugResponse({ psychologist: normalized });
    }
    const response = await api.put('/psychologists/me/profile', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  uploadProfileImage: (file) => {
    if (DEBUG_API_MODE) {
      const nextProfile = setDebugProfile({ profileImage: file ? '/debug/psychologist-profile.png' : '' });
      return debugResponse({ profileImage: nextProfile.profileImage });
    }
    const formData = new FormData();
    formData.append('psychologistProfile', file);
    return api.post('/psychologists/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAccount: () => {
    if (DEBUG_API_MODE) return debugResponse({ ok: true });
    return api.delete('/psychologists/me/account');
  },
  uploadDocuments: (files, documentTypes, config = {}) => {
    if (DEBUG_API_MODE) {
      return debugResponse({
        uploaded: files.length,
        documentTypes,
      });
    }
    const formData = new FormData();
    files.forEach((file) => formData.append('psychologistDoc', file));
    formData.append('documentTypes', JSON.stringify(documentTypes));
    return api.post('/psychologists/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
      ...config,
    });
  },
  getSubscription: async () => {
    if (DEBUG_API_MODE) {
      return debugResponse(debugSubscriptionState);
    }
    const response = await api.get('/psychologists/me/subscription');
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  createSubscription: async (data) => {
    if (DEBUG_API_MODE) {
      const subscription = {
        id: `sub-debug-${Date.now()}`,
        plan: data.plan,
        amount: Number(data.amount) || 0,
        currency: data.currency || 'ARS',
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
      };
      debugSubscriptionState.hasActiveSubscription = true;
      debugSubscriptionState.subscription = subscription;
      setDebugProfile({ status: 'ACTIVE' });
      return debugResponse({ hasActiveSubscription: true, subscription });
    }
    const response = await api.post('/psychologists/me/subscription', data);
    return { ...response, data: repairMojibakeDeep(response.data) };
  },
  getIncomingRequests: () => {
    if (DEBUG_API_MODE) {
      return debugResponse(getDebugRequestContext('psychologist'));
    }
    return api.get('/psychologists/me/requests');
  },
  updateRequestStatus: (id, status) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.status = status;
      }
      return debugResponse({ request: request ? clone(request) : null });
    }
    return api.put(`/psychologists/requests/${id}/status`, { status });
  },
  blockRelationship: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.blockInfo = {
          message: 'Relación bloqueada por el profesional.',
          blockedByMe: false,
        };
      }
      return debugResponse({
        request: request ? clone(request) : null,
        blockInfo: request?.blockInfo || null,
      });
    }
    return api.post(`/psychologists/requests/${id}/block`);
  },
  unblockRelationship: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.blockInfo = null;
      }
      return debugResponse({ request: request ? clone(request) : null });
    }
    return api.delete(`/psychologists/requests/${id}/block`);
  },
  acceptTermination: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.terminationAcceptedAt = new Date().toISOString();
      }
      return debugResponse({ request: request ? clone(request) : null });
    }
    return api.put(`/psychologists/requests/${id}/termination/accept`);
  },
};

// ==================== PSYCHOLOGIST REQUESTS (patient side) ====================

export const psychologistRequestService = {
  send: (psychologistId, message) => {
    if (DEBUG_API_MODE) {
      const patient = getDebugPatient();
      const psychologist = getDebugPublicPsychologists().find((item) => String(item.id) === String(psychologistId))
        || getDebugProfile();
      const request = {
        id: `req-debug-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        message: message || null,
        patient: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          profileImage: patient.profileImage || '',
        },
        psychologist: {
          id: psychologist.id,
          firstName: psychologist.firstName,
          lastName: psychologist.lastName,
          displayName: psychologist.displayName,
          phone: psychologist.phone,
          contactEmail: psychologist.contactEmail,
          specialties: clone(psychologist.specialties || []),
          profileImage: psychologist.profileImage || '',
        },
        blockInfo: null,
        terminationRequestedAt: null,
        terminationAcceptedAt: null,
      };
      upsertDebugRelationship(request);
      return debugResponse({ request });
    }
    return api.post('/psychologists/requests', { psychologistId, message });
  },
  getMyRequests: () => {
    if (DEBUG_API_MODE) {
      return debugResponse(getDebugRequestContext('patient'));
    }
    return api.get('/psychologists/requests/mine');
  },
  cancel: (id) => {
    if (DEBUG_API_MODE) {
      const idx = debugRelationships.findIndex((item) => item.id === id);
      if (idx >= 0) {
        debugRelationships.splice(idx, 1);
      }
      return debugResponse({ ok: true });
    }
    return api.delete(`/psychologists/requests/${id}`);
  },
  blockRelationship: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.blockInfo = {
          message: 'Relación bloqueada por el paciente.',
          blockedByMe: true,
        };
      }
      return debugResponse({
        request: request ? clone(request) : null,
        blockInfo: request?.blockInfo || null,
      });
    }
    return api.post(`/psychologists/requests/${id}/block`);
  },
  unblockRelationship: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.blockInfo = null;
      }
      return debugResponse({ request: request ? clone(request) : null });
    }
    return api.delete(`/psychologists/requests/${id}/block`);
  },
  requestTermination: (id) => {
    if (DEBUG_API_MODE) {
      const request = debugRelationships.find((item) => item.id === id);
      if (request) {
        request.terminationRequestedAt = new Date().toISOString();
      }
      return debugResponse({ request: request ? clone(request) : null });
    }
    return api.post(`/psychologists/requests/${id}/termination`);
  },
  getContactInfo: (psychologistId) => {
    if (DEBUG_API_MODE) {
      const psychologist = getDebugPublicPsychologists().find((item) => String(item.id) === String(psychologistId))
        || getDebugProfile();
      return debugResponse({
        phone: psychologist.phone,
        contactEmail: psychologist.contactEmail,
      });
    }
    return api.get(`/psychologists/${psychologistId}/contact`);
  },
};
