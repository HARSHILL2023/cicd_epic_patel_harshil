import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';

/**
 * Register a new user.
 * Validates uniqueness, hashes password, stores user, returns JWT.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
        data: null,
        error: { message: 'Missing fields' }
      });
    }
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        data: null,
        error: { message: 'Duplicate email' }
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed });
    // Generate JWT with user id
    const token = generateToken({ id: user._id });
    const userData = { id: user._id, name: user.name, email: user.email };
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: userData, token },
      error: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      data: null,
      error: { message: err.message }
    });
  }
};

/**
 * Login existing user.
 * Validates credentials and returns JWT.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: null,
        error: { message: 'Missing fields' }
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
        error: { message: 'User not found' }
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
        error: { message: 'Password mismatch' }
      });
    }
    const token = generateToken({ id: user._id });
    const userData = { id: user._id, name: user.name, email: user.email };
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userData, token },
      error: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      data: null,
      error: { message: err.message }
    });
  }
};

/**
 * Get profile of authenticated user.
 * Middleware already attached user document (without password) to req.user.
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: { message: 'No user in request' }
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User profile fetched',
      data: { user },
      error: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      data: null,
      error: { message: err.message }
    });
  }
};
