import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token.
 * @param {Object} payload - Data to embed in the token (e.g., { id: userId }).
 * @returns {string} Signed JWT token.
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a JWT token.
 * @param {string} token - JWT token string.
 * @returns {Object} Decoded payload.
 * @throws Will throw if token is invalid or expired.
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};
