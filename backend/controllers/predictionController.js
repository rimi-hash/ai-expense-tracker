/**
 * Prediction Controller
 * Handles expense prediction endpoints
 */

const { predictNextMonth } = require('../utils/predictor');

/**
 * Get expense prediction for next month
 * GET /api/prediction
 */
const getPrediction = async (req, res) => {
  try {
    const prediction = await predictNextMonth(req.userId);

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPrediction
};
