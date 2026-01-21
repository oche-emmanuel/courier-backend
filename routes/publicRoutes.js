const express = require('express');
const router = express.Router();
const { getShipment } = require('../controllers/shipmentController');

router.get('/track/:trackingId', getShipment);

module.exports = router;
