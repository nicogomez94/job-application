const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const userController = require('../controllers/user.controller');
const { authenticateUser, authenticateUserAccount } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');
const { EMAIL_VALIDATION_MESSAGE, isValidEmail } = require('../utils/emailValidation');

// Validaciones
const updateProfileValidation = [
  body('email').optional().trim().normalizeEmail().custom(isValidEmail).withMessage(EMAIL_VALIDATION_MESSAGE),
  body('firstName').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('lastName').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  validate,
];

// El CV y los adjuntos forman parte del alta inicial y se permiten antes de
// confirmar el email. El resto de las funciones requiere email verificado.
router.post('/upload/cv', authenticateUserAccount, upload.single('cv'), userController.uploadCV);
router.post('/upload/file', authenticateUserAccount, upload.single('file'), userController.uploadOtherFile);
router.delete('/account', authenticateUserAccount, userController.deleteAccount);

router.use(authenticateUser);

// Perfil
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);

// Uploads
router.delete('/upload/cv', userController.deleteCV);
router.delete('/upload/file/:index', userController.deleteOtherFile);
router.post('/upload/profile-image', upload.single('profileImage'), userController.uploadProfileImage);

// Postulaciones
router.get('/applications', userController.getMyApplications);

module.exports = router;
