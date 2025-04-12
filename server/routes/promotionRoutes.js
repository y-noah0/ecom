import express from 'express';
import promotionController from '../controllers/promotionController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/active', promotionController.getActive);

// Admin only routes
router.post('/', [auth, admin], promotionController.create);
router.get('/', [auth, admin], promotionController.getAll);
router.put('/:id', [auth, admin], promotionController.update);
router.delete('/:id', [auth, admin], promotionController.delete);

export default router;