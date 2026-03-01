const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const adminController = require('../controllers/admin.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación de admin
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard/metrics', adminController.getDashboardMetrics);

// ==================== USUARIOS ====================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);

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

// ==================== ADMINISTRADORES ====================
router.post('/admins', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  body('role').optional().isIn(['ADMIN', 'SUPER_ADMIN']).withMessage('Rol inválido'),
  validate,
], adminController.createAdmin);

module.exports = router;
