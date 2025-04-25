const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { storage } = require('../cloudconfig');
const { isLoggedin, saveUrl, isOwner, validateListing } = require('../middleware.js');
const ListingController = require('../controller/listing.js');
const multer = require('multer');
const Upload = multer({ storage });
const Listing = require('../models/listing');

// Route to fetch and render listings
router.get('/', wrapAsync(ListingController.index));

// Route to create a new listing
router
  .route('/')
  .post(isLoggedin, Upload.single('listing[image]'), wrapAsync(ListingController.create));

// Route to render the form for creating a new listing
router.get('/new', saveUrl, isLoggedin, ListingController.renderForm);

// Routes for showing, editing, updating, and deleting a listing
router
  .route('/:id')
  .get(ListingController.showList)
  .put(
      isLoggedin,
      isOwner,
      Upload.single('listing[image]'), // Handle the uploaded image
      validateListing,
      wrapAsync(ListingController.Update)
  )
  .delete(isLoggedin, isOwner, ListingController.Delete);

// Route to render the edit form
router.get('/:id/edit', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new Error('Listing not found');
        }
        const OriginalImage = listing.image ? listing.image.url : null; // Use the URL or filename of the image
        res.render('listings/edit', { listing, OriginalImage });
    } catch (err) {
        next(err);
    }
});

module.exports = router;