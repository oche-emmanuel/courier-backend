const Shipment = require('../models/Shipment');

// Helper to generate tracking ID
const generateTrackingId = () => {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CRS-${year}-${result}`;
};

// @desc    Create a new shipment
// @route   POST /admin/create-shipment
// @access  Private
const createShipment = async (req, res) => {
    try {
        const { sender, receiver, origin, destination } = req.body;

        // Validate required fields
        if (!sender || !receiver || !origin || !destination) {
            return res.status(400).json({ 
                message: 'Missing required fields: sender, receiver, origin, destination' 
            });
        }

        const trackingId = generateTrackingId();

        const shipment = new Shipment({
            trackingId,
            sender,
            receiver,
            currentStatus: 'Shipment Created',
            currentLocation: origin,
            history: [{
                status: 'Shipment Created',
                location: origin,
                message: 'Shipment has been created',
                timestamp: new Date()
            }]
        });

        const createdShipment = await shipment.save();
        res.status(201).json(createdShipment);
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(400).json({ message: 'Invalid shipment data', error: error.message });
    }
};

// @desc    Add tracking update
// @route   POST /admin/update-tracking
// @access  Private
const updateTracking = async (req, res) => {
    const { trackingId, status, location, message } = req.body;

    const shipment = await Shipment.findOne({ trackingId });

    if (shipment) {
        const newUpdate = {
            status,
            location,
            message,
            timestamp: new Date()
        };

        shipment.history.push(newUpdate);
        shipment.currentStatus = status;
        shipment.currentLocation = location;

        const updatedShipment = await shipment.save();
        res.json(updatedShipment);
    } else {
        res.status(404).json({ message: 'Shipment not found' });
    }
};

// @desc    Get shipment by tracking ID
// @route   GET /track/:trackingId
// @access  Public
const getShipment = async (req, res) => {
    const { trackingId } = req.params;

    const shipment = await Shipment.findOne({ trackingId });

    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({ message: 'Tracking ID does not exist' });
    }
};

// @desc    Get all shipments (Admin)
// @route   GET /admin/all-shipments
// @access  Private
const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({}).sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update shipment details
// @route   PUT /admin/shipment/:id
// @access  Private
const updateShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (shipment) {
            shipment.sender = req.body.sender || shipment.sender;
            shipment.receiver = req.body.receiver || shipment.receiver;
            shipment.currentStatus = req.body.currentStatus || shipment.currentStatus;
            shipment.currentLocation = req.body.currentLocation || shipment.currentLocation;

            const updatedShipment = await shipment.save();
            res.json(updatedShipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating shipment', error: error.message });
    }
};

// @desc    Delete shipment
// @route   DELETE /admin/shipment/:id
// @access  Private
const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (shipment) {
            await shipment.deleteOne();
            res.json({ message: 'Shipment removed' });
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createShipment,
    updateTracking,
    getShipment,
    getAllShipments,
    updateShipment,
    deleteShipment
};
