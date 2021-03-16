const express = require('express')
const authenticate = require('../config/auth')
const Counter = require('../models/counter')
const router = express.Router()

// regular user
router.get('/', authenticate.ensureAuthenticated, async (req, res) => {
    const counter = await Counter.find({})
    res.render('./dashboard/user.ejs', { user: req.user, counter })
})


// admin
router.get('/admin', authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
    const counter = await Counter.find({})
    res.render('./dashboard/admin.ejs', { user: req.user, counter })
})


module.exports = router