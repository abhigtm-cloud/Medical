const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const accessToken = process.env.MAPBOX_TOKEN; // Ensure this matches the .env variable name

if (!accessToken) {
    throw new Error('Mapbox access token is missing. Check your .env file.');
}

const geocodingClient = mbxGeocoding({ accessToken });

module.exports.index = async (req, res) => {
  const listings = await Listing.find({}); // Fetch all listings
  res.render('listings/index.ejs', { listings }); // Pass listings to the template
};

module.exports.renderForm = (req, res) => {
  res.render('listings/new');
};

module.exports.showList = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' },
    }).populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};

module.exports.create = async (req, res) => {
  const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename }; // Save image details
  }

  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();

  req.flash('success', 'Successfully added a new listing!');
  res.redirect('/listings');
};

module.exports.Edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Cannot find listing for editing!');
    return res.redirect('/listings');
  }
  res.render('listings/edit', { listing });
};

module.exports.Update = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename }; // Update image details
    await listing.save();
  }

  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
};

module.exports.Delete = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
};