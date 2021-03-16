const mongoose = require("mongoose");

const AdviceSchema = new mongoose.Schema({
    workout: {
        type: String
    },
    diet: {
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

const Advice = mongoose.model('Advice', AdviceSchema);
module.exports = Advice