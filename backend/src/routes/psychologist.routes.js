const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const upload = require('../config/upload');

const psychologistAuthController = require('../controllers/psychologistAuth.controller');
const psychologistController = require('../controllers/psychologist.controller');
const psychologistPublicController = require('../controllers/psychologistPublic.controller');
const { authenticatePsychologist, authenticateAdmin, checkActivePsychologistSubscription } = require('../middlewares/auth.middleware');

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

// Auth
router.post(
  '/auth/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    body('registrationType').isIn(['ARGENTINA', 'INTERNATIONAL']).withMessage('Tipo de registro inválido'),
    validate,
  ],
  psychologistAuthController.register
);

router.post(
  '/auth/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate,
  ],
  psychologistAuthController.login
);

// Public listing + profile
router.get('/', psychologistPublicController.list);
router.get('/plans', psychologistController.getPlans);

// ─── PROTECTED: PSYCHOLOGIST ─────────────────────────────────────────────────

router.get('/me/profile', authenticatePsychologist, psychologistController.getProfile);

router.put('/me/profile', authenticatePsychologist, psychologistController.updateProfile);

router.post(
  '/me/profile-image',
  authenticatePsychologist,
  upload.single('psychologistProfile'),
  psychologistController.uploadProfileImage
);

router.post(
  '/me/documents',
  authenticatePsychologist,
  upload.array('psychologistDoc', 10),
  psychologistController.uploadDocuments
);

router.get('/me/subscription', authenticatePsychologist, psychologistController.getSubscription);

router.post(
  '/me/subscription',
  authenticatePsychologist,
  [
    body('plan').isIn(['MONTHLY', 'QUARTERLY', 'ANNUAL']).withMessage('Plan inválido'),
    body('amount').isDecimal().withMessage('El monto debe ser un número'),
    body('paymentMethod').optional().isIn(['free', 'mercadopago', 'manual']),
    body('paymentStatus').optional().isIn(['free', 'approved', 'pending', 'rejected']),
    validate,
  ],
  psychologistController.createSubscription
);

// ─── PROTECTED: ADMIN ────────────────────────────────────────────────────────

router.get('/admin/all', authenticateAdmin, psychologistController.adminList);
router.post('/admin/:id/approve', authenticateAdmin, psychologistController.adminApprove);
router.post(
  '/admin/:id/reject',
  authenticateAdmin,
  [body('reason').optional().isString(), validate],
  psychologistController.adminReject
);

// Keep the dynamic public route at the end so static routes match first.
router.get('/:id', psychologistPublicController.getById);

module.exports = router;
