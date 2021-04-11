const express = require("express");
const router = express.Router();
const {
  postLogin,
  postSignup,
  postChangePassword,
} = require("../controller/userAuth");
router.post("/login", postLogin);
router.post("/signup", postSignup);
// router.post("/change-password", postChangePassword);
module.exports = router;
