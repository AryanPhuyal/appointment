const { check, body } = require("express-validator");

const express = require("express");
const router = express.Router();
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
  getHospitalLogin,
  postHospitalLogin
} = require("../controller/auth");

// validation files
const {
  emailValidation,
  firstName,
  passwordValidation,
  phoneValidation
} = require("../validation/validation");

router.get("/signup", getSignup);
router.post(
  "/signup",
  firstName,
  emailValidation,
  passwordValidation,
  phoneValidation,
  postSignup
);

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", postLogout);
router.get("/hospital-login", getHospitalLogin);
router.post("/hospital-login", postHospitalLogin);
module.exports = router;
