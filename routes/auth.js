// auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Signup Route
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/auth/login'); // Redirect to login page after signup
    } catch (err) {
        res.redirect('/auth/signup'); // Redirect back to signup page on error
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            req.session.user = user; // Store user in session
            res.redirect('/'); // Redirect to JournoBook page after successful login
        } else {
            res.redirect('/auth/login'); // Redirect back to login page on failed login
        }
    } catch (err) {
        console.error(err);
        res.redirect('/auth/login'); // Redirect on error
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/auth/login'); // Redirect to login page after logout
    });
});

module.exports = router;
