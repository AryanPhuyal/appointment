module.exports = (req, res, next) => {
  if (req.session.userType !== "hospital") {
    return res.redirect("/auth/hospital-login");
  }
  next();
};
