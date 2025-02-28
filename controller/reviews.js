const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.posting = async (req, res) => {
    let List = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    List.reviews.push(newReview);
    await newReview.save();
    await List.save();
    req.flash("success", "Successfully added a review");
    res.redirect(`/listings/${List._id}`);
}
module.exports.Delete =  async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Successfully deleted a review");
    res.redirect(`/listings/${id}`);
}