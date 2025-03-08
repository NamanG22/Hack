const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    fromBic: {
        type: String,
        required: true,
        ref: 'Bank'
    },
    toBic: {
        type: String,
        required: true,
        ref: 'Bank'
    },
    timeTakenMinutes: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Route', routeSchema);