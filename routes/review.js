const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedin, isReviewAuthor } = require('../middleware.js');
const ReviewController = require("../controller/reviews.js");

router.post("/", isLoggedin, validateReview, wrapAsync(ReviewController.posting));

router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(ReviewController.Delete));

module.exports = router;