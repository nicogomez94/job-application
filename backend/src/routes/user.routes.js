const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const userController = require('../controllers/user.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');

// Validaciones
const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('firstName').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('lastName').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  validate,
];

// Rutas protegidas para usuarios
router.use(authenticateUser);

// Perfil
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.delete('/account', userController.deleteAccount);

// Uploads
router.post('/upload/cv', upload.single('cv'), userController.uploadCV);
router.delete('/upload/cv', userController.deleteCV);
router.post('/upload/file', upload.single('file'), userController.uploadOtherFile);
router.delete('/upload/file/:index', userController.deleteOtherFile);
router.post('/upload/profile-image', upload.single('profileImage'), userController.uploadProfileImage);

// Postulaciones
router.get('/applications', userController.getMyApplications);

module.exports = router;
