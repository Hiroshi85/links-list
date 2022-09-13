const express = require('express')
const router = express.Router()
const passport = require('passport')

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')
const {signinIndex, profileIndex, logoutIndex} = require('../controllers/authentication');

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', 
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })
)

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {ip: req.ip})
})

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin')
})

router.post('/signin', 
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })
)

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin')
});


module.exports = router