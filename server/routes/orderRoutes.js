import express from 'express';
import orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, orderController.create);
router.get('/my-orders', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOne);
router.put('/:id/status', auth, orderController.updateStatus);

export default router;