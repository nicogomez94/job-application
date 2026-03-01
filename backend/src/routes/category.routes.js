const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validator.middleware');
const categoryController = require('../controllers/category.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas protegidas para admin
const categoryValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('slug').notEmpty().withMessage('El slug es requerido'),
  validate,
];

router.post('/', authenticateAdmin, categoryValidation, categoryController.createCategory);
router.put('/:id', authenticateAdmin, categoryValidation, categoryController.updateCategory);
router.delete('/:id', authenticateAdmin, categoryController.deleteCategory);

module.exports = router;
