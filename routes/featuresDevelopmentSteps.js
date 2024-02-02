const express = require('express');
const { fetchAndGroupDevelopmentSteps } = require('../helpers/developmentStepsHelper');

const router = express.Router();

router.get('/features_development_steps', async (req, res) => {
  const featureIndex = parseInt(req.query.feature_index);
  const appId = req.query.app_id;
  const dbName = req.query.db;

  if (!Number.isInteger(featureIndex) || !appId) {
    return res.status(400).send('Feature index integer and app ID are required');
  }

  try {
    const groupedSteps = await fetchAndGroupDevelopmentSteps(appId, dbName);
    if (featureIndex < 0 || featureIndex >= groupedSteps.length) {
      return res.status(404).send('Feature index out of bounds');
    }
    res.json(groupedSteps[featureIndex]);
  } catch (error) {
    console.error('Error fetching grouped development steps:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;