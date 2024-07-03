const express = require('express')
const mongoose = require('mongoose')
const Paper = require('./models/paper')
const paperRouter = require('./routes/papers')
const authRouter = require('./routes/auth')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()

mongoose.connect('mongodb://localhost/journobook')

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})

function checkAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

app.get('/', checkAuthenticated, async (req, res) => {
    const papers = await Paper.find().sort({createdAt: 'desc'})
    res.render('papers/index', {papers: papers})
})

app.use('/papers', paperRouter)
app.use('/auth', authRouter)

app.listen(5000)