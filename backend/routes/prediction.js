/**
 * Prediction Routes
 */

const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/auth');

// All prediction routes require authentication
router.use(authMiddleware);

router.get('/', predictionController.getPrediction);

module.exports = router;
