const mongoose = require("mongoose");

const DetailSchema = new mongoose.Schema({
    bmi: {
        type: Number
    },
    goals: {
        type: String
    },
    others: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Detail = mongoose.model('Detail', DetailSchema);
module.exports = Detail