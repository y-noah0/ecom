import express from 'express';
import categoryController from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin only routes
router.post('/', [auth, admin], categoryController.createCategory);
router.put('/:id', [auth, admin], categoryController.updateCategory);
router.delete('/:id', [auth, admin], categoryController.deleteCategory);

export default router;