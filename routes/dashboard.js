const express = require('express')
const authenticate = require('../config/auth')
const Counter = require('../models/counter')
const Subscriptions = require('../models/subscription')
const router = express.Router()

router.get('/', authenticate.ensureAuthenticated, async (req, res) => {
    const counter = await Counter.find({})
    const subscription = await Subscriptions.find({ user: req.user._id })
    res.render('./dashboard/dashboard.ejs', { user: req.user, counter, subscription: subscription[0] })
})

module.exports = router