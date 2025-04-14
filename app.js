if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

console.log("Mapbox Token:", process.env.MAP_TOKEN); // Debug line
console.log(process.env.SECRET);

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const connectFlash = require('connect-flash');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const Doctor = require('./models/Doctor');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log('MongoDB is connected');
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(Mongo_URL);
}

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.update = req.flash("update");
  res.locals.currentUser = req.user;

  next();
});

app.get('/demo', async (req, res) => {
  let fakeUser = new User({
      email: "abhi@gmail.com",
      username: "abhi"
  });
  const newUser = await User.register(fakeUser, "password");
  res.send(newUser);
});

app.use('/listings', listingRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went Wrong !" } = err;
  res.status(statusCode).render("error", { err });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
