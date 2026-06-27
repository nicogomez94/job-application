const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const companyController = require('../controllers/company.controller');
const { authenticateCompany } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');
const { EMAIL_VALIDATION_MESSAGE, isValidEmail } = require('../utils/emailValidation');

// Validaciones
const updateProfileValidation = [
  body('email').optional().trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('companyName').optional().notEmpty().withMessage('El nombre de la empresa no puede estar vacío'),
  validate,
];

// Rutas protegidas para empresas
router.use(authenticateCompany);

// Perfil
router.get('/profile', companyController.getProfile);
router.put('/profile', updateProfileValidation, companyController.updateProfile);
router.delete('/account', companyController.deleteAccount);

// Upload logo
router.post('/upload/logo', upload.single('companyLogo'), companyController.uploadLogo);

// Suscripción
router.get('/subscription/status', companyController.checkSubscription);
router.get('/subscription/history', companyController.getSubscriptionHistory);

module.exports = router;
