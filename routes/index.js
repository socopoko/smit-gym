const express = require('express')
const authenticate = require('../config/auth')
const router = express.Router()

// login page
router.get('/', (req, res) => {
    res.render('index')
})

//register page 
router.get('/register', (req, res) => {
    res.render('register')
})

// dashboard 
router.get('/dashboard', authenticate.ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
})

module.exports = router