const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generatePasswordResetToken = (
  payload,
  expiresIn = process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN || '30m',
) => {
  const secret = process.env.RESET_PASSWORD_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ ...payload, purpose: 'password_reset' }, secret, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyPasswordResetToken = (token) => {
  try {
    const secret = process.env.RESET_PASSWORD_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    if (decoded.purpose !== 'password_reset') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};
