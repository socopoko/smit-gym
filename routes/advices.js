const express = require('express')
const authenticate = require('../config/auth')
const Advice = require('../models/advice')
const router = express.Router()


router.route('/')
    .get(authenticate.ensureAuthenticated, async (req, res) => {
        const advices = await Advice.find({ "user": req.user }).populate('user')
        res.render('./advice/show.ejs', { user: req.user, advices })
    })
    .post(authenticate.ensureAuthenticated, async (req, res) => {
        const advice = new Advice({
            workout: req.body.workout,
            diet: req.body.diet,
            others: req.body.others,
            user: req.body.user
        })
        try {
            const newAdvice = await advice.save()
            req.flash('success_msg', 'Advice sent!')
            res.redirect('/users')
        } catch {
            req.flash('error_msg', 'Advice not sent. Please try again.')
            res.redirect('/users')
        }
    })

module.exports = router