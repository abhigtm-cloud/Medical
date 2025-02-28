const Listing   = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const accessToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: accessToken });

module.exports.index = async (req, res) => {
    
    const listings = await Listing.find({});
  
    res.render("listings/index.ejs", { listings: listings });
}
module.exports.renderForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showList = async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id).populate({
        path :"reviews",
        populate : {
            path : "author"
        },
    }).populate("owner");
    if(!List){
        req.flash("error", "Cannot Find Listing !");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing: List });
}

module.exports.create = async (req, res, next) => {

   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let { listing } = req.body;
    let newListing = new Listing(listing);
    
    newListing.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename};
    newListing.geometry = response.body.features[0].geometry;
    console.log(newListing.geometry);
    await newListing.save();
  
    req.flash("success", "Successfully Added New Listing !");
    res.redirect("/listings");
}

module.exports.Edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot Find Listing for Edit !");
        return res.redirect("/listings");
    }
    let OriginalImage = listing.image.url;
    OriginalImage = OriginalImage.replace("upload", "upload/w_200,h_200,c_thumb");
    res.render("listings/edit", { listing, OriginalImage });
}

module.exports.Update = async (req, res) => {
    const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
    listing.image = { url, filename};
        await listing.save();
    }
    req.flash("update", "Successfully Updated Listing !");
    res.redirect(`/listings/${id}`);
}

module.exports.Delete =  async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Successfully Deleted Listing !");
    res.redirect("/listings");
}