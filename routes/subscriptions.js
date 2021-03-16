const express = require('express')
const authenticate = require('../config/auth')
const router = express.Router()


router.route('/')
    .get(authenticate.ensureAuthenticated, (req, res) => {
        res.render('./subscriptions/show.ejs', { user: req.user })
    })

module.exports = router