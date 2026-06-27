const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const adminController = require('../controllers/admin.controller');
const psychologistController = require('../controllers/psychologist.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');
const { EMAIL_VALIDATION_MESSAGE, isValidEmail } = require('../utils/emailValidation');

// Todas las rutas requieren autenticación de admin
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard/metrics', adminController.getDashboardMetrics);

// ==================== USUARIOS ====================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);

// ==================== PACIENTES ====================
router.get('/patients', adminController.getAllPatients);
router.delete('/patients/:id', adminController.deletePatient);

// ==================== EMPRESAS ====================
router.get('/companies', adminController.getAllCompanies);
router.get('/companies/:id', adminController.getCompanyById);
router.put('/companies/:id/block', [
  body('isBlocked').isBoolean().withMessage('isBlocked debe ser booleano'),
  validate,
], adminController.toggleCompanyBlock);
router.delete('/companies/:id', adminController.deleteCompany);

// ==================== SUSCRIPCIONES ====================
router.get('/subscriptions', adminController.getAllSubscriptions);

// ==================== OFERTAS ====================
router.get('/job-offers', adminController.getAllJobOffers);
router.delete('/job-offers/:id', adminController.deleteJobOffer);

// ==================== PSICÓLOGOS ====================
router.get('/psychologists', psychologistController.adminList);
router.post('/psychologists/:id/approve', psychologistController.adminApprove);
router.delete('/psychologists/:id', psychologistController.adminDelete);
router.post('/psychologists/:id/reject', [
  body('reason').optional().isString().withMessage('El motivo debe ser texto'),
  validate,
], psychologistController.adminReject);

// ==================== ADMINISTRADORES ====================
router.post('/admins', [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  body('role').optional().isIn(['ADMIN', 'SUPER_ADMIN']).withMessage('Rol inválido'),
  validate,
], adminController.createAdmin);

module.exports = router;
