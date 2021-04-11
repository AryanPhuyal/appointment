const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { addUser } = require("../utility/user");

const { validationResult } = require("express-validator");

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(400).json({
          error: "User or password is incorrect email",
        });
      }
      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          jwt.sign(
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              gender: user.gender,
              photoUrl: user.photoUrl,
            },
            process.env.JWT,
            (err, token) => {
              if (!err) {
                return res.json({
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  gender: user.gender,
                  photoUrl: user.photoUrl,
                  token: token,
                });
              }
              return console.log(err);
            }
          );
        } else {
          return res.status(400).json({
            error: "User or password is incorrect",
          });
        }
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors,
    });
  }
  addUser(req, (err, data) => {
    if (!err) {
      return res.json({
        success: data,
      });
    }
    if (err == 500) {
      return res.status(500).json({
        error: "Server error",
      });
    }
    return res.json({
      error: err,
    });
  });
};
