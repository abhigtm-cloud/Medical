const { reviewSchema } = require('./schema.js');
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema.js');

module.exports.isLoggedin = (req, res, next) => {
    // console.log(req.path , ".." , req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of the Listing !");
       return res.redirect(`/listings/${id}`);
    }
    next(); 
};

module.exports.validateListing = (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError('Invalid Listing Data', 400);
    }
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const erMSG = error.details.map(el => el.message).join(',');
        throw new ExpressError(erMSG, 400);
    } else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        next(new ExpressError(errMsg, 400));
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of the Listing !");
       return res.redirect(`/listings/${id}`);
    }
    next();
}