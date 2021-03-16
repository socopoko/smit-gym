const express = require('express')
const authenticate = require('../config/auth')
const Detail = require('../models/detail')
const router = express.Router()


router.route('/')
    .get(authenticate.ensureAuthenticated, async (req, res) => {
        const details = await Detail.find({ "user": req.user }).populate('user')
        res.render('./details/show.ejs',{ user: req.user.name, details })
    })
    
    

router.route('/new')
    .get(authenticate.ensureAuthenticated, (req, res) => {
        res.render('./details/form.ejs', { user: req.user })
    })
    .post(authenticate.ensureAuthenticated, async (req, res) => {
        const detail = new Detail({
            bmi: req.body.bmi,
            goals: req.body.goals,
            others: req.body.others,
            user: req.user._id
        })
        try {
            const newDetail = await detail.save()
            req.flash('success_msg', 'Details sent!')
            res.redirect('/dashboard')
        } catch {
            req.flash('error_msg', 'Details not sent. Please try again.')
            res.redirect('/details')
        }
    })

module.exports = router