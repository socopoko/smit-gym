const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Advice = require('../models/advice')
const Detail = require('../models/advice')
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

        // console.log('Name: ' + name + ' email: ' + email + ' password: ' + password)

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
                // console.log(user);
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
        const users = await User.find({ "admin": false })
        res.render('./users/show.ejs', { users })
    })

// user page (admin)
router.route('/:id/details')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            const details = await Detail.find({ user: req.params.id })
            res.render('./users/details.ejs', { user: user, details: details })
        } catch {
            res.redirect('/users')
        }
    })

router.route('/:id/advices')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            const advices = await Advice.find({ user: req.params.id })
            res.render('./users/advices.ejs', { user: user, advices: advices })
        } catch {
            res.redirect('/users')
        }
    })

router.route('/:id/advices/new')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            res.render('./advice/form.ejs', { user: user })
        } catch {
            res.redirect('/users')
        }
    })
    


module.exports = router