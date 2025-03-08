const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    bicCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    charge: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Bank', bankSchema);