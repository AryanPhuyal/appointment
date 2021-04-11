module.exports = (req, res, next) => {
  // res.locals.csrfToken = req.csrfToken();
  res.locals.csrfToken = "dsfsfsdfsdfdsfsd";
  next();
};
