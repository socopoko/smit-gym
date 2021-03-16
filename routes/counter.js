const express = require('express')
const authenticate = require('../config/auth')
const Counter = require('../models/counter')
const router = express.Router()


router.route('/')
    .post(authenticate.ensureAuthenticated, authenticate.ensureAdmin, (req, res) => {
        const counter = ({
            count: req.body.count
        })
        
        Counter.deleteMany({})
            .then((resp) => {
                Counter.create(counter)
                    .then((resp) => {
                        res.redirect('/dashboard/admin')
                    })
                    .catch((err) => next(err))
            })
            .catch((err) => console.error(err))
    })

module.exports = router