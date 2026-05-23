import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Protected profile endpoint
router.get('/profile', authMiddleware, getUserProfile);

export default router;
