const express = require('express')
const authenticate = require('../config/auth')
const Video = require('../models/video')
const router = express.Router()


// video library
router.get('/', authenticate.ensureAuthenticated, async (req, res) => {
    let query = Video.find()
    if(req.query.title != null && req.query.name != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const videos = await query.exec()
        res.render('./videolibrary/show.ejs', { user: req.user, videos, searchOptions: req.query })
    } catch {
        res.redirect('/')
    }
})

router.route('/new')
    .get(authenticate.ensureAuthenticated, authenticate.ensureAdmin, (req, res) => {
        res.render('./videolibrary/new.ejs', { user: req.user })
    })
    .post(authenticate.ensureAuthenticated, authenticate.ensureAdmin, async (req, res) => {
        const video = new Video({
            title: req.body.title,
            description: req.body.description,
            url: req.body.url
        })
        try {
            const newVideo = await video.save()
            req.flash('success_msg', 'Video posted!')
            res.redirect('/videolibrary')
        } catch {
            req.flash('error_msg', 'Video not posted. Please try again.')
            res.redirect('/videolibrary/new')
        }
    })
    

module.exports = router