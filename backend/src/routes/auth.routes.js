// src/routes/auth.routes.js
import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation } from '../validations/auth.validation.js';

const router = express.Router();

// Register a new user (with input validation)
router.post('/register', registerValidation, registerUser);

// Login existing user (with input validation)
router.post('/login', loginValidation, loginUser);

// Get authenticated user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

export default router;
