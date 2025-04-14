const mongoose = require('mongoose');
const Listing = require('../models/listing');

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(Mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log('MongoDB connection error:', err);
    });

const seedListings = async () => {
    await Listing.deleteMany({});
    const listings = [
        {
            name: "Cozy Apartment",
            description: "A beautiful apartment in the city center.",
            price: 120,
            location: "Downtown",
            image: {
                filename: "apartmentimage",
                url: "https://images.unsplash.com/photo-1576765607924-1e6b7f3aebb3",
            },
        },
        {
            name: "Luxury Villa",
            description: "A luxurious villa with a private pool.",
            price: 500,
            location: "Suburbs",
            image: {
                filename: "villaimage",
                url: "https://images.unsplash.com/photo-1580281657521-936a5cb4a0d5",
            },
        },
    ];
    await Listing.insertMany(listings);
    console.log('Database seeded with listings');
    mongoose.connection.close();
};

seedListings();