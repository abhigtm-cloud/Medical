// filepath: d:\DATA\Project\models\doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Assuming you have a Hospital model
        required: true,
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);