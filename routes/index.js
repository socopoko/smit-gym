const express = require('express')
const authenticate = require('../config/auth')
const router = express.Router()

// login page
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router