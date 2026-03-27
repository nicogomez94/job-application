const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const subscriptionController = require('../controllers/subscription.controller');
const { authenticateCompany } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/plans', subscriptionController.getPlans);
router.post('/webhook/mercadopago', subscriptionController.mercadoPagoWebhook);

// Rutas protegidas para empresas
router.use(authenticateCompany);

// Gestión de suscripciones
router.post('/', [
  body('plan').isIn(['TRIAL', 'MONTHLY', 'QUARTERLY', 'ANNUAL']).withMessage('Plan inválido'),
  body('amount').isDecimal().withMessage('El monto debe ser un número'),
  body('paymentId').optional().isString(),
  // paymentMethod: 'free' = período gratuito | 'mercadopago' = pago real
  body('paymentMethod').optional().isIn(['free', 'mercadopago', 'manual']).withMessage('Método de pago inválido'),
  // paymentStatus: 'free' = gratuito | 'approved' = aprobado por MP
  body('paymentStatus').optional().isIn(['free', 'approved', 'pending', 'rejected']).withMessage('Estado de pago inválido'),
  validate,
], subscriptionController.createSubscription);

router.get('/active', subscriptionController.getActiveSubscription);
router.get('/history', subscriptionController.getCompanySubscriptions);
router.put('/:id/cancel', subscriptionController.cancelSubscription);

module.exports = router;
