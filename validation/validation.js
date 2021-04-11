const { check, body } = require("express-validator");
const User = require("../model/User");
const Hospital = require("../model/Hospital");

exports.emailValidation = [
  body("email")
    .isEmail()
    .withMessage("Emails should be in someone@something.com")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    })
];

exports.firstName = [
  body("firstName")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Dont leave First Name field empty")
    .isString()
    .withMessage("FirstName Must Be String")
    .isLength({ min: 2, max: 10 })
    .withMessage("Name should between 2 and 10"),
  body("lastName")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Dont leave Last Name Fiend Empty")
    .isString()
    .withMessage("First Name Must Be String")
    .isLength({ min: 2, max: 10 })
    .withMessage("Last Name should between 2 and 10")
];

exports.passwordValidation = [
  body("password")
    .isLength({
      min: 5,
      max: 15
    })
    .withMessage("Passsword Must be of Len gth between 5 and 15"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match!");
    }
    return true;
  })
];

exports.phoneValidation = [
  body("phone")
    .isMobilePhone()
    .withMessage("Is not a Phone No"),
  body("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Must Select any one gender")
];

exports.hospitalUserName = [
  body("userName")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Dont leave User Name empty ")
    .isString()
    .withMessage("User Name Must Be String")
    .isLength({ min: 2, max: 10 })
    .withMessage("User Name should between 2 and 10")
    .custom((value, { req }) => {
      return Hospital.findOne({ userName: value }).then(hospitalDoc => {
        if (hospitalDoc) {
          return Promise.reject(
            "User Name exists already, please pick a different one."
          );
        }
      });
    })
];

exports.hospitalName = [
  body("hospitalName")
    .isLength({
      min: 2,
      max: 100
    })
    .withMessage("Hospital Name must be length 2 to 100")
];

exports.hospitalPassword = [
  body("password")
    .isLength({
      min: 5,
      max: 15
    })
    .withMessage("Password Must be of Len gth between 5 and 15")
];
exports.editEmailValidation = [
  body("email")
    .isEmail()
    .withMessage("Emails should be in someone@something.com")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          if (userDoc._id != req.body.id) {
            return Promise.reject(
              "E-Mail is taken by another user, please pick a different one."
            );
          }
        }
      });
    })
];
