const express = require("express");
const app = express();
//const morgan = require("morgan");
//app.use(morgan("dev"));
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./model/User");
const Hospital = require("./model/Hospital");
const dotenv = require("dotenv");
dotenv.config();
// middleware
const hospitalMiddleware = require("./middleware/is_hospital");
//csrf

// const csrf = require("csurf");
// const csrfProtection = csrf();
const csrfMiddleware = require("./middleware/csufr");
// json web token
const jwtToken = require("./middleware/jwtToken");
// config path

const store = new MongoDbStore({
  uri: process.env.DATABASE,
  collection: "session",
});

// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // Session Middle ware
app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
// csrf token middleware
// Csrf token is used as middle ware in for route excluding api route
// Check user loggin status

// Check hospital user if logged in

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      logInUser = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  if (!req.session.hospital) {
    return next();
  }
  Hospital.findById(req.session.hospital._id)
    .then((hospital) => {
      req.hospital = hospital;
      next();
    })
    .catch((err) => console.log(err));
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("connected to database");
    app.listen(process.env.PORT || 3000, () =>
      console.log("listining to the port 3000")
    );
  })
  .catch((err) => console.log(err));

// routes

// user auth
const userAuth = require("./route/userAuth");
app.use("/api/auth", userAuth);

// user route
const user = require("./route/user");
app.use("/api/", jwtToken, user);

// admin Route
const adminRoute = require("./route/admin");
app.use(
  "/admin",
  // csrfProtection,
  csrfMiddleware,
  adminRoute
);

// authencation routes
const auth = require("./route/auth");
app.use(
  "/auth",
  //   csrfProtection,
  csrfMiddleware,
  auth
);
// hospital route
const hospitalRoute = require("./route/hospital");
app.use(
  "/hospital",
  hospitalMiddleware,
  //   csrfProtection,
  csrfMiddleware,
  hospitalRoute
);
// public route
const public = require("./route/public");
app.use("/", public);

// error route
app.use("/", (req, res) => {
  res.render("pageNotFound", {
    pageTitle: "Page Not Found",
    path: "",
  });
});
