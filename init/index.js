const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log('MongoDB is connected');
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=> ({
      ...obj,
       owner : "67bc906a07feb5b00e5b9c9e",
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data added");
};
initDB();