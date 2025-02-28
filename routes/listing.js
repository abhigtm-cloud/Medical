const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {storage} = require('../cloudconfig');
const Listing = require('../models/listing');
const fs = require('fs');
const path = require('path');
const {isLoggedin, saveUrl, isOwner,validateListing}= require("../middleware.js");
const ListingController =  require("../controller/listing.js");

const multer = require('multer');
const Upload = multer({storage:storage});

router
.route("/")
.get( wrapAsync(ListingController.index))
.post( isLoggedin, Upload.single("listing[image]"),wrapAsync(ListingController.create));


// New Route
router.get("/new",saveUrl, isLoggedin,ListingController.renderForm);


router
.route("/:id")
.get(ListingController.showList)
.put(isLoggedin,isOwner,Upload.single("listing[image]") ,validateListing, wrapAsync(ListingController.Update))
.delete(isLoggedin,isOwner,ListingController.Delete);  


// Edit Route
router.get("/:id/edit",isLoggedin,isOwner , ListingController.Edit);


module.exports = router;