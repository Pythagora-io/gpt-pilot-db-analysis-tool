const express = require('express');
const { getFeaturesByAppId } = require('../handlers/features-handler');

const router = express.Router();

router.get('/features_development_plans', async (req, res) => {
  const featureIndex = parseInt(req.query.feature_index);
  const appId = req.query.app_id;
  const dbName = req.query.db;

  if (isNaN(featureIndex)) {
    return res.status(400).send('Feature index must be a valid integer');
  }

  if (!appId || !dbName) {
    return res.status(400).send('App ID and database name are required');
  }

  try {
    const featuresWithPlans = await getFeaturesByAppId(appId, dbName);

    if (featureIndex < 0 || featureIndex >= featuresWithPlans.length) {
      return res.status(404).send('Feature index out of bounds');
    }

    const requestedFeature = featuresWithPlans[featureIndex];
    res.json(requestedFeature.development_tasks);
  } catch (error) {
    res.status(500).send('Error fetching features with development plans.');
  }
});

module.exports = router;