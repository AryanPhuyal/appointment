const User = require("../model/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { addUser } = require("../utility/user");

exports.getSignup = (req, res) => {
  if (req.session.userType === "hospital") {
    res.render("hospital/add-doctor", {
      editing: false,
      pageTitle: "/hospital",
      link: "/hospital",
      error: "",
      editing: false
    });
  }
  res.render("auth/signup", {
    pageTitle: "SignUp",
    link: "/signup",
    error: "",
    editing: false
  });
};

exports.postSignup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "SignUp",
      link: "/signup",
      error: errors.array()[0].msg
    });
  }
  addUser(req, err => {
    if (err == null) {
      console.log(!err);
      return res.redirect("/auth/login");
    }
    console.log(err);
  });
};

exports.getLogin = (req, res) => {
  res.render("auth/login.ejs", {
    pageTitle: "login",
    link: "/login",
    error: "",
    isHospital: false,
    editing: false
  });
};

exports.postLogin = (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  User.findOne({ email: userName }).then(user => {
    if (!user) {
      res.render("auth/login", {
        pageTitle: "SignUp",
        path: "/auth/login",
        error: "User Not Found"
      });
    }
    bcrypt.compare(password, user.password).then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.userType = user.userType;
        if (user.userType == "admin") {
          return res.redirect("/admin");
        }
        return res.redirect("/user");
      } else {
        res.render("auth/login", {
          pageTitle: "SignUp",
          path: "auth/login",
          error: "Email or password not found"
        });
      }
    });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

const Hospital = require("../model/Hospital");

exports.getHospitalLogin = (req, res) => {
  res.render("auth/hospitalLogin.ejs", {
    pageTitle: "login",
    link: "/login",
    error: "",
    isHospital: true
  });
};

exports.postHospitalLogin = (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  Hospital.findOne({ userName: userName })
    .then(hospital => {
      if (!hospital) {
        console.log(hospital);
        res.render("auth/hospitalLogin", {
          pageTitle: "SignUp",
          link: "/login",
          error: "Hospital Not Found"
        });
      }
      bcrypt.compare(password, hospital.password).then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.hospital = hospital;
          req.session.userType = "hospital";
          res.redirect("/hospital");
        } else {
          res.render("auth/hospitalLogin", {
            pageTitle: "SignUp",
            path: "/login",
            isHospital: true,
            error: "Email or password not Correct"
          });
        }
      });
    })
    .catch(err => console.log(err));
};
