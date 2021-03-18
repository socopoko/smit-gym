if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// passport config
require('./config/passport')(passport)

// mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connected to mongoose'))
.catch((err) => console.log(err))

// EJS
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressEjsLayout)

// Static Folder
app.use(express.static(__dirname + '/public'))

// BodyParser
app.use(express.urlencoded({ extended: false}))

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// use flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/videolibrary', require('./routes/videolibrary'))
app.use('/advices', require('./routes/advices'))
app.use('/details', require('./routes/details'))
app.use('/subscription', require('./routes/subscriptions'))
app.use('/counter',require('./routes/counter') )

app.listen(process.env.PORT || 3000)