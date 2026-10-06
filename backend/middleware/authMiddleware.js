const { verifyToken } = require('../utils/jwt');
const db = require('../config/db');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }

  // Ensure user still exists in DB
  const user = db.findOne('users', u => u.id === decoded.id);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User associated with this token no longer exists.' });
  }

  // Sanitize password before attaching
  const { password, ...sanitizedUser } = user;
  req.user = sanitizedUser;
  next();
};

module.exports = { authenticateToken };
