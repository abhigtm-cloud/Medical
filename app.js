if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

console.log("Mapbox Token:", process.env.MAPBOX_TOKEN); // Debugging line

//basic database setups

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" }); // Destination folder for uploads

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { Server } = require("http");
const Listing = require('./models/listing');

mongoose.set('strictPopulate', false);

//MOGODB ATLUS Server
// const Mongo_URL = process.env.ATLAS_URL;
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB")
})
.catch(() => {
    console.log(err);
});

async function main() {  
    await mongoose.connect(Mongo_URL);  
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")) 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const store = MongoStore.create({
    mongoUrl: Mongo_URL, 
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, 
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.update = req.flash("update");
    res.locals.currentUser = req.user; // Use "currentUser" consistently
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get('/mapbox-token', (req, res) => {
    res.json({ mapToken: process.env.MAPBOX_TOKEN });
});

app.get('/listings/:id', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('owner') // Populate the owner field
            .populate('reviews'); // Populate the reviews field
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render('listings/show', { listing });
    } catch (err) {
        next(err);
    }
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
}); 


app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).sendStatus(message);
}); 


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});