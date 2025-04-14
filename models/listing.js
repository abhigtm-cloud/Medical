const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure the name is required
    },
    description: String,
    price: Number,
    image: {
        filename: String,
        url: String,
    },
    location: String,
    country: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});

module.exports = mongoose.model('Listing', listingSchema);
