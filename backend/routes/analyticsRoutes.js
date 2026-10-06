const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, getDashboardAnalytics);

module.exports = router;
