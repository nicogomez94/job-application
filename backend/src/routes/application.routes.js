const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const applicationController = require('../controllers/application.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

// Validaciones
const applyValidation = [
  body('coverLetter').optional().isString().withMessage('La carta de presentación debe ser texto'),
  validate,
];

// Rutas protegidas para usuarios
router.use(authenticateUser);

// Postular a ofertas
router.post('/:jobOfferId/apply', applyValidation, applicationController.applyToJob);
router.get('/:id', applicationController.getApplication);
router.delete('/:id', applicationController.cancelApplication);
router.put('/:id/cover-letter', [
  body('coverLetter').notEmpty().withMessage('La carta de presentación es requerida'),
  validate,
], applicationController.updateCoverLetter);
router.put('/:id/rating', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La puntuación debe estar entre 1 y 5'),
  validate,
], applicationController.rateCompany);

module.exports = router;
