// src/validations/auth.validation.js
import { body, validationResult } from 'express-validator';

/**
 * Middleware to check validation results.
 * Returns 422 with errors array if validation failed.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      data: null,
      error: { details: errors.array() }
    });
  }
  next();
};

/**
 * Validation rules for POST /auth/register
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidation
];

/**
 * Validation rules for POST /auth/login
 */
export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidation
];
