const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const jobOfferController = require('../controllers/jobOffer.controller');
const { authenticateCompany, checkActiveSubscription } = require('../middlewares/auth.middleware');

const POSTING_LANGUAGE_OPTIONS = ['es', 'en', 'pt', 'fr', 'de', 'it'];

// Validaciones
const createJobOfferValidation = [
  body('title').notEmpty().withMessage('El título es requerido'),
  body('description').notEmpty().withMessage('La descripción es requerida'),
  body('location').notEmpty().withMessage('La ubicación es requerida'),
  body('categoryId').notEmpty().withMessage('La categoría es requerida'),
  body('requirements').isArray().withMessage('Los requisitos deben ser un array'),
  body('responsibilities').isArray().withMessage('Las responsabilidades deben ser un array'),
  body('postingLanguage')
    .optional()
    .customSanitizer((value) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    .isIn(POSTING_LANGUAGE_OPTIONS)
    .withMessage('Idioma del anuncio inválido'),
  validate,
];

// Rutas públicas
router.get('/search', jobOfferController.searchJobOffers);
router.get('/:id', jobOfferController.getJobOfferById);

// Rutas protegidas para empresas
router.use(authenticateCompany);

// CRUD de ofertas (requiere suscripción activa)
router.post('/', checkActiveSubscription, createJobOfferValidation, jobOfferController.createJobOffer);
router.get('/company/my-offers', jobOfferController.getCompanyJobOffers);
router.put('/:id', checkActiveSubscription, createJobOfferValidation, jobOfferController.updateJobOffer);
router.delete('/:id', jobOfferController.deleteJobOffer);

// Gestión de postulantes
router.get('/:id/applicants', jobOfferController.getJobOfferApplicants);
router.put('/applications/:applicationId/status', [
  body('status').isIn(['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWED', 'REJECTED', 'ACCEPTED'])
    .withMessage('Estado inválido'),
  validate,
], jobOfferController.updateApplicationStatus);
router.put('/applications/:applicationId/rating', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La puntuación debe estar entre 1 y 5'),
  validate,
], jobOfferController.rateApplicationByCompany);

module.exports = router;
