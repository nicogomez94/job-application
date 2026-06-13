const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const upload = require('../config/upload');

const psychologistAuthController = require('../controllers/psychologistAuth.controller');
const patientAuthController = require('../controllers/patientAuth.controller');
const psychologistController = require('../controllers/psychologist.controller');
const psychologistPublicController = require('../controllers/psychologistPublic.controller');
const psychologistRequestController = require('../controllers/psychologistRequest.controller');
const {
  authenticate,
  authorizeRole,
  optionalAuthenticate,
  authenticatePsychologist,
  authenticateAdmin,
  authenticatePatient,
} = require('../middlewares/auth.middleware');

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

// Patient auth for the psychology section. This is intentionally separate from
// the Professionals at Home postulante account.
router.post(
  '/patients/auth/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    body('gender').optional().isIn(['Hombre', 'Mujer', 'Otro']).withMessage('Género inválido'),
    validate,
  ],
  patientAuthController.register
);

router.post(
  '/patients/auth/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate,
  ],
  patientAuthController.login
);

// Public listing + profile
router.get('/', optionalAuthenticate, psychologistPublicController.list);
router.get('/plans', psychologistController.getPlans);

// ─── PROTECTED: PSYCHOLOGIST ─────────────────────────────────────────────────

router.get('/me/profile', authenticatePsychologist, psychologistController.getProfile);

router.put('/me/profile', authenticatePsychologist, psychologistController.updateProfile);

router.put(
  '/me/availability',
  authenticatePsychologist,
  [
    body('isAvailable').isBoolean().withMessage('Estado de disponibilidad inválido'),
    validate,
  ],
  psychologistController.updateAvailability
);

router.delete('/me/account', authenticatePsychologist, psychologistController.deleteAccount);

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

router.put(
  '/me/documents/:id',
  authenticatePsychologist,
  upload.single('psychologistDoc'),
  psychologistController.replaceDocument
);

router.delete(
  '/me/documents/:id',
  authenticatePsychologist,
  psychologistController.deleteDocument
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

// Psychologist views incoming hiring requests
router.get('/me/requests', authenticatePsychologist, psychologistRequestController.getIncomingRequests);

// ─── PROTECTED: PATIENT ──────────────────────────────────────────────────────

// Send a hiring request
router.post(
  '/requests',
  authenticatePatient,
  [
    body('psychologistId').notEmpty().withMessage('El id del psicólogo es requerido'),
    body('message').optional().isString().withMessage('El mensaje debe ser texto'),
    validate,
  ],
  psychologistRequestController.sendRequest
);

// List own requests
router.get('/requests/mine', authenticatePatient, psychologistRequestController.getMyRequests);

// Cancel a PENDING request
router.delete('/requests/:id', authenticatePatient, psychologistRequestController.cancelRequest);

router.put(
  '/patients/me/profile',
  authenticatePatient,
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    body('gender').optional({ nullable: true, checkFalsy: true }).isIn(['Hombre', 'Mujer', 'Otro']).withMessage('Género inválido'),
    body('currentPassword').optional({ nullable: true, checkFalsy: true }).isString(),
    body('newPassword').optional({ nullable: true, checkFalsy: true }).isLength({ min: 6 }).withMessage('La contraseña nueva debe tener al menos 6 caracteres'),
    validate,
  ],
  patientAuthController.updateProfile
);

// Patient uploads their own profile image
router.post(
  '/patients/me/profile-image',
  authenticatePatient,
  upload.single('patientProfile'),
  patientAuthController.uploadProfileImage
);

router.delete('/patients/me/account', authenticatePatient, patientAuthController.deleteAccount);

// Patient or psychologist blocks the other side after an ACCEPTED request
router.post(
  '/requests/:id/block',
  authenticate,
  authorizeRole('patient', 'psychologist'),
  psychologistRequestController.blockRelationship
);

router.delete(
  '/requests/:id/block',
  authenticate,
  authorizeRole('patient', 'psychologist'),
  psychologistRequestController.unblockRelationship
);

router.post(
  '/requests/:id/termination',
  authenticatePatient,
  psychologistRequestController.requestTermination
);

router.put(
  '/requests/:id/termination/accept',
  authenticatePsychologist,
  psychologistRequestController.acceptTermination
);

// Psychologist accepts or rejects a request
router.put(
  '/requests/:id/status',
  authenticatePsychologist,
  [
    body('status').isIn(['ACCEPTED', 'REJECTED']).withMessage('Estado inválido'),
    validate,
  ],
  psychologistRequestController.updateRequestStatus
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
router.get('/:id/contact', authenticatePatient, psychologistRequestController.getContactInfo);
router.get('/:id', optionalAuthenticate, psychologistPublicController.getById);

module.exports = router;
