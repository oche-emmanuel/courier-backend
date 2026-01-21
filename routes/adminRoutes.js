const express = require('express');
const router = express.Router();
const { authAdmin, updateAdminProfile } = require('../controllers/authController');
const { createShipment, updateTracking, getAllShipments, updateShipment, deleteShipment } = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.put('/profile', protect, updateAdminProfile);
router.post('/create-shipment', protect, createShipment);
router.post('/update-tracking', protect, updateTracking);
router.get('/all-shipments', protect, getAllShipments);
router.put('/shipment/:id', protect, updateShipment);
router.delete('/shipment/:id', protect, deleteShipment);

module.exports = router;
