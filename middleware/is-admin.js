module.exports = (req, res, next) => {
  if (req.session.userType !== "admin") {
    return res.redirect("/auth/login");
  }
  next();
};
