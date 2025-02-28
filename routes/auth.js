const express = require('express');
const router = express.Router();
const passport = require('passport');

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login'); // Redirect to login page after logout
        });
    });
});

module.exports = router;
