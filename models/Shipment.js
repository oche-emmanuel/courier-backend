const mongoose = require('mongoose');

const shipmentSchema = mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    sender: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String }
    },
    receiver: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        contact: { type: String }
    },
    currentStatus: {
        type: String,
        required: true,
        default: 'Shipment Created'
    },
    currentLocation: {
        type: String,
        required: true
    },
    history: [
        {
            status: { type: String, required: true },
            location: { type: String, required: true },
            message: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
