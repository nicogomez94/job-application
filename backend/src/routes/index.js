const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const jobOfferRoutes = require('./jobOffer.routes');
const applicationRoutes = require('./application.routes');
const adminRoutes = require('./admin.routes');
const subscriptionRoutes = require('./subscription.routes');
const categoryRoutes = require('./category.routes');

const router = express.Router();

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Job Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// Registro de rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/job-offers', jobOfferRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
