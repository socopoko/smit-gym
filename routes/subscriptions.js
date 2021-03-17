const express = require('express')
const authenticate = require('../config/auth')
const Subscription = require('../models/subscription')
const router = express.Router()
const stripe = require('stripe')(process.env.SECRET_KEY)


router.route('/')
    .get(authenticate.ensureAuthenticated, async (req, res) => {
        const subscription = await Subscription.find({ "user": req.user })
        res.render('./subscriptions/show.ejs', { user: req.user, subscription: subscription[0] })
    })
    .post(authenticate.ensureAuthenticated, (req, res) => {
        try {
            stripe.customers
                .create({
                    name: req.user.name,
                    email: req.user.email,
                    source: req.body.stripeToken
                })
                .then(customer =>
                    stripe.charges.create({
                        amount: req.body.amount * 100,
                        currency: "inr",
                        customer: customer.id
                    })
                )
                .then(() => res.render('./subscriptions/completed.ejs', { user: req.user, amount: req.body.amount }))
                .catch(err => console.log(err))
        } catch (err) {
            req.flash('error_msg', 'Payment Unsuccessful. Please try again.')
            res.redirect('/subscription')
        }
    })

router.route('/new')
    .post(authenticate.ensureAuthenticated, async (req, res) => {
        const subscription = ({
            expiry: req.body.expiry,
            user: req.user._id
        })

        Subscription
            .deleteMany({ user: req.user._id })
            .then((resp) => {
                Subscription.create(subscription)
                    .then((resp) => {
                        res.redirect('/dashboard')
                    })
                    .catch((err) => next(err))
            })
            .catch((err) => console.error(err))
    }) 

module.exports = router