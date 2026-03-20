import api from './api';

// ==================== AUTH ====================

export const authService = {
  // Usuarios
  registerUser: (data) => api.post('/auth/user/register', data),
  loginUser: (data) => api.post('/auth/user/login', data),

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
  deleteAccount: () => api.delete('/users/account'),
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
};
