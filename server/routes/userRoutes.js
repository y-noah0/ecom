import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Admin only routes
router.get('/all-users', [auth, admin], userController.getAllUsers);
router.delete('/user/:id', [auth, admin], userController.deleteUser);
router.put('/user/:id/role', [auth, admin], userController.updateUserRole);
router.get('/:id', [auth, admin], userController.getUserById);

export default router;