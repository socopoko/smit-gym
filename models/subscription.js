const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    expiry: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeslot: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Subscriptions = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscriptions