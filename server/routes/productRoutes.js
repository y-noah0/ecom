import express from 'express';
import productController, { filterProducts } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Public routes - no auth required
router.get('/filter', filterProducts); // Note: This route should come before '/:id'
router.get('/', productController.getProducts);
router.get('/:id', productController.getOne);

// Admin-only routes - requires both auth and admin middleware
router.post('/', [auth, admin], productController.createProduct);
router.put('/:id', [auth, admin], productController.update);
router.delete('/:id', [auth, admin], productController.delete);

export default router;