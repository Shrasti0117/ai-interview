const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Upcoming', 'In Progress', 'Completed'],
        default: 'Upcoming'
    },
    assignedTo: {
        type: String,
        default: "All Users"
    }
}, { timestamps: true });

module.exports = mongoose.model('Planner', plannerSchema);
