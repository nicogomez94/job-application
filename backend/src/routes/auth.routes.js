const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const passport = require('../config/passport');

// Validaciones
const registerUserValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  validate,
];

const registerCompanyValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('companyName').notEmpty().withMessage('El nombre de la empresa es requerido'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate,
];

const recoverPasswordValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('userType')
    .optional()
    .isIn(['user', 'company', 'admin'])
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

// ==================== USUARIOS ====================

// Registro y login usuario
router.post('/user/register', registerUserValidation, authController.registerUser);
router.post('/user/login', loginValidation, authController.loginUser);

// Google OAuth para usuarios
router.get('/user/google', passport.authenticate('google-user', { scope: ['profile', 'email'], session: false }));
router.get('/user/google/callback',
  passport.authenticate('google-user', { session: false }),
  (req, res) => {
    const { generateToken } = require('../config/jwt');
    const token = generateToken({ id: req.user.id, type: 'user' });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&type=user`);
  }
);

// ==================== EMPRESAS ====================

// Registro y login empresa
router.post('/company/register', registerCompanyValidation, authController.registerCompany);
router.post('/company/login', loginValidation, authController.loginCompany);

// Google OAuth para empresas
router.get('/company/google', passport.authenticate('google-company', { scope: ['profile', 'email'], session: false }));
router.get('/company/google/callback',
  passport.authenticate('google-company', { session: false }),
  (req, res) => {
    const { generateToken } = require('../config/jwt');
    const token = generateToken({ id: req.user.id, type: 'company' });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&type=company`);
  }
);

// ==================== ADMINISTRADORES ====================

// Login admin
router.post('/admin/login', loginValidation, authController.loginAdmin);

// Recuperación de clave
router.post('/recover-password', recoverPasswordValidation, authController.requestPasswordRecovery);
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

// ==================== PERFIL ====================

// Obtener perfil del usuario autenticado (cualquier tipo)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
