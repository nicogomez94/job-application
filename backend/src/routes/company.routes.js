const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const companyController = require('../controllers/company.controller');
const { authenticateCompany, authenticateCompanyAccount } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');
const { EMAIL_VALIDATION_MESSAGE, isValidEmail } = require('../utils/emailValidation');

// Validaciones
const updateProfileValidation = [
  body('email').optional().trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('companyName').optional().notEmpty().withMessage('El nombre de la empresa no puede estar vacío'),
  validate,
];

// El logo forma parte del alta inicial. Las demás funciones requieren email verificado.
router.post('/upload/logo', authenticateCompanyAccount, upload.single('companyLogo'), companyController.uploadLogo);
router.delete('/account', authenticateCompanyAccount, companyController.deleteAccount);

router.use(authenticateCompany);

// Perfil
router.get('/profile', companyController.getProfile);
router.put('/profile', updateProfileValidation, companyController.updateProfile);

// Suscripción
router.get('/subscription/status', companyController.checkSubscription);
router.get('/subscription/history', companyController.getSubscriptionHistory);

module.exports = router;
