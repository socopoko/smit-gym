const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Counter = mongoose.model('Counter', CounterSchema);
module.exports = Counter