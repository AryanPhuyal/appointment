const multer = require("multer");

// static storage
// set up multer
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads");
  },

  filename: (req, file, callback) => {
    callback(
      null,
      Date.now() +
        "-" +
        file.filename +
        "-" +
        Date.now() +
        "." +
        file.originalname
          .trim()
          .split(".")
          .pop()
    );
  }
});

exports.upload = multer({ storage: storage });
