const express = require('express')
const authenticate = require('../config/auth')
const router = express.Router()


// video library
router.get('/', authenticate.ensureAuthenticated, (req, res) => {
    res.render('./videolibrary/show.ejs')
})

module.exports = router