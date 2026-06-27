const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const passport = require('../config/passport');
const { generateToken } = require('../config/jwt');
const { getDefaultFrontendUrl } = require('../config/frontend');
const { EMAIL_VALIDATION_MESSAGE, isValidEmail } = require('../utils/emailValidation');

const getFrontendBaseUrl = () => getDefaultFrontendUrl();

const normalizeOAuthErrorMessage = (errorLike) => {
  const rawMessage = typeof errorLike === 'string' ? errorLike : errorLike?.message;
  const message = String(rawMessage || '').trim();
  const loweredMessage = message.toLowerCase();
  const code = errorLike?.code;
  const targetFields = Array.isArray(errorLike?.meta?.target)
    ? errorLike.meta.target.map((field) => String(field).toLowerCase())
    : [];

  const isEmailDuplicate =
    code === 'P2002' ||
    targetFields.includes('email') ||
    (loweredMessage.includes('ya existe') && loweredMessage.includes('email')) ||
    loweredMessage.includes('unique constraint') ||
    loweredMessage.includes('duplicate');

  if (isEmailDuplicate) {
    return 'Ese email ya esta registrado. Inicia sesion o recupera tu clave.';
  }

  if (!message) {
    return 'No se pudo completar el login con Google';
  }

  return message;
};

const buildOAuthCallbackRedirect = ({ token, type, error }) => {
  const params = new URLSearchParams({ type });
  if (token) params.set('token', token);
  if (error) params.set('error', error);
  return `${getFrontendBaseUrl()}/auth/callback?${params.toString()}`;
};

const handleOAuthCallback = (strategyName, accountType) => (req, res, next) => {
  passport.authenticate(strategyName, { session: false }, (err, account, info) => {
    if (err) {
      const errorMessage = normalizeOAuthErrorMessage(err);
      return res.redirect(buildOAuthCallbackRedirect({ type: accountType, error: errorMessage }));
    }

    if (!account) {
      const errorMessage = normalizeOAuthErrorMessage(info);
      return res.redirect(buildOAuthCallbackRedirect({ type: accountType, error: errorMessage }));
    }

    const token = generateToken({ id: account.id, type: accountType });
    return res.redirect(buildOAuthCallbackRedirect({ token, type: accountType }));
  })(req, res, next);
};

// Validaciones
const registerUserValidation = [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  validate,
];

const registerCompanyValidation = [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('companyName').notEmpty().withMessage('El nombre de la empresa es requerido'),
  validate,
];

const loginValidation = [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate,
];

const recoverPasswordValidation = [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('userType')
    .optional()
    .isIn(['user', 'company', 'patient', 'psychologist', 'admin'])
    .withMessage('Tipo de usuario inválido'),
  validate,
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('El token es requerido'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validate,
];

const resendEmailVerificationValidation = [
  body('email').trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('userType')
    .isIn(['user', 'company', 'patient', 'psychologist'])
    .withMessage('Tipo de usuario inválido'),
  validate,
];

const verifyEmailValidation = [
  query('token').notEmpty().withMessage('El token de confirmación es requerido'),
  validate,
];

// ==================== USUARIOS ====================

// Registro y login usuario
router.post('/user/register', registerUserValidation, authController.registerUser);
router.post('/user/login', loginValidation, authController.loginUser);

// Google OAuth para usuarios
router.get('/user/google', passport.authenticate('google-user', { scope: ['profile', 'email'], session: false }));
router.get('/user/google/callback', handleOAuthCallback('google-user', 'user'));

// ==================== EMPRESAS ====================

// Registro y login empresa
router.post('/company/register', registerCompanyValidation, authController.registerCompany);
router.post('/company/login', loginValidation, authController.loginCompany);

// Google OAuth para empresas
router.get('/company/google', passport.authenticate('google-company', { scope: ['profile', 'email'], session: false }));
router.get('/company/google/callback', handleOAuthCallback('google-company', 'company'));

// ==================== ADMINISTRADORES ====================

// Login admin
router.post('/admin/login', loginValidation, authController.loginAdmin);

// Recuperación de clave
router.post('/recover-password', recoverPasswordValidation, authController.requestPasswordRecovery);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);
router.post('/resend-verification', resendEmailVerificationValidation, authController.requestEmailVerification);
router.get('/verify-email', verifyEmailValidation, authController.verifyEmail);

// ==================== PERFIL ====================

// Obtener perfil del usuario autenticado (cualquier tipo)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
