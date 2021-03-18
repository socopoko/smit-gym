const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Advice = require('../models/advice')
const Detail = require('../models/detail')
const Subscriptions = require('../models/subscription')
const bcrypt = require('bcrypt');
const passport = require('passport');
const authenticate = require('../config/auth')

// login handle
router.route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true,
        }) (req, res, next)
    })


// register handle
router.route('/register')
    .get((req, res) => {
        res.render('register')
    })
    .post((req, res) => {
        const { name, email, password, password2 } = req.body
        let errors = [];

        if (!name || !email || !password || !password2) {
            errors.push({msg: "Please fill in all fields"})
        }

        // check if match
        if (password !== password2) {
            errors.push({msg: "Passwords do not match"})
        }

        // check if password is more than 6 characters
        if (password.length < 6) {
            errors.push({msg: "Password atleast 6 characters"})
        }

        if(errors.length > 0) {
            res.render('register', {
                errors: errors,
                name: name,
                email: email,
                password: password,
                password2: password2
            })
        } else {
            // validation passed
            User.findOne({email: email}).exec((err, user) => {
                if(user) {
                    errors.push({msg: 'Email already registered'});
                    res.render('register', {errors, name, email, password, password2})
                } else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    })

                    // hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt,
                            (err, hash) => {
                                if (err) throw err;

                                //save pass to hash
                                newUser.password = hash;

                                //save user
                                newUser
                                    .save()
                                    .then((value) => {
                                        req.flash('success_msg', 'You have now registered!')
                                        res.redirect('/users/login');
                                    })
                                    .catch(value => console.log(value));
                            }));
                }
            })
        }
    })

// logout 
router.route('/logout')
    .get((req, res) => {
        req.logout();
        req.flash('success_msg', 'Logged out');
        res.redirect('/users/login');
    })

// all users (admin)
router.route('/')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        let query = User.find({ "admin": false })
        if(req.query.name != null && req.query.name != '') {
            query = query.regex('name', new RegExp(req.query.name, 'i'))
        }
        if (req.query.email != null && req.query.email != '') {
            query = query.regex('email', new RegExp(req.query.email, 'i'))
        }
        try {
            const users = await query.exec()
            res.render('./users/show.ejs', { user: req.user, users, searchOptions: req.query })
        } catch {
            res.redirect('/')
        }
    })

// user page (admin)
router.route('/:id/details')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const trainee = await User.findById(req.params.id)
            const details = await Detail.find({ user: req.params.id })
            res.render('./users/details.ejs', { trainee: trainee, details: details, user: req.user })
        } catch {
            res.redirect('/users')
        }
    })

router.route('/:id/advices')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const trainee = await User.findById(req.params.id)
            const advices = await Advice.find({ user: req.params.id })
            res.render('./users/advices.ejs', { trainee: trainee, advices: advices, user: req.user })
        } catch {
            res.redirect('/users')
        }
    })

router.route('/:id/advices/new')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const trainee = await User.findById(req.params.id)
            res.render('./advice/form.ejs', { trainee: trainee, user: req.user  })
        } catch {
            res.redirect('/users')
        }
    })
    

router.route('/:id/subscription')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const trainee = await User.findById(req.params.id)
            const subscriptions = await Subscriptions.find({ user: req.params.id })
            res.render('./users/subscription.ejs', { trainee: trainee, subscription: subscriptions[0], user: req.user })
        } catch {
            res.redirect('/users')
        }
    })


module.exports = router