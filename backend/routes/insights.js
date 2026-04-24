/**
 * Insights Routes
 */

const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');
const authMiddleware = require('../middleware/auth');

// All insight routes require authentication
router.use(authMiddleware);

router.get('/monthly', insightController.getMonthlyInsights);
router.get('/categories', insightController.getCategoryBreakdown);
router.get('/anomalies', insightController.getAnomalies);
router.get('/trend', insightController.getSpendingTrend);

module.exports = router;
