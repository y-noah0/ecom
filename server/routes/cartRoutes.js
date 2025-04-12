import express from 'express';
import cartController from '../controllers/CartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addItem);
router.put('/update', auth, cartController.updateItem);
router.delete('/item/:itemId', auth, cartController.removeItem);
router.delete('/clear', auth, cartController.clearCart);

export default router;