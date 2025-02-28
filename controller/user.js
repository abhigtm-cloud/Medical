const User = require("../models/user");
module.exports.RenderPage =  (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.Posting = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // Corrected variable name
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);

            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.Log = async(req, res) => {
    req.flash('success', 'Welcome to Wanderlust');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.Logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
}