import express from 'express';
import orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.post('/', auth, orderController.create);
router.get('/', [auth,admin], orderController.getAllOrders);
router.get('/my-orders', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOne);
router.put('/:id/status', [auth,admin], orderController.updateStatus);

export default router;