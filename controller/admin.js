const Hospital = require("../model/Hospital");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const bcript = require("bcryptjs");

exports.getAddHospital = (req, res) => {
  res.render("admin/addHospital", {
    pageTitle: "Add Hospital",
    link: "/admin/add-hospital",
    editing: false,
    error: "",
  });
};

exports.postAddHospital = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/addHospital", {
      pageTitle: "Add Hospital",
      link: "/admin/add-hospital",
      editing: false,
      error: errors.array()[0].msg,
    });
  }
  const userName = req.body.userName;
  const password = req.body.password;
  const hospitalName = req.body.hospitalName;
  const description = req.body.description;
  const location = req.body.location;
  const phone = req.body.phone;
  const status = req.body.status;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      return (hospital = new Hospital({
        userName: userName,
        hospitalName: hospitalName,
        description: description,
        status: status,
        password: hashedPassword,
        location: location,
        phone: phone,
      }));
    })
    .then((hospital) => {
      return hospital.save();
    })
    .then((result) => {
      res.redirect("/admin/add-hospital");
    })
    .catch((err) => console.log(err));
};

exports.getHospitals = (req, res) => {
  Hospital.find()
    .then((hospitals) => {
      res.render("admin/hospital", {
        pageTitle: "Hospital List",
        link: "/admin/hospitals",
        hospitals: hospitals,
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditHospital = (req, res) => {
  hospitalId = req.params.hospitalId;
  Hospital.findById(hospitalId)
    .then((hospital) => {
      console.log(hospital);
      res.render("admin/addHospital", {
        pageTitle: "Add Hospital",
        link: "/admin/add-hospital",
        editing: true,
        error: "",
        hospital: hospital,
      });
    })
    .catch((err) => {});
};

exports.postEditHospital = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Hospital.findById(hospitalId)
      .then((hospital) => {
        console.log(hospital);
        return res.render("admin/addHospital", {
          pageTitle: "Add Hospital",
          link: "/admin/add-hospital",
          editing: true,
          error: errors[1],
          hospital: hospital,
        });
      })
      .catch((err) => {});
  }
  const id = req.body.id;
  const password = req.body.password;
  const hospitalName = req.body.hospitalName;
  const description = req.body.description;
  const status = req.body.status;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      Hospital.findById(id)
        .then((hospital) => {
          hospital.password = hashedPassword;
          hospital.description = description;
          hospital.hospitalName = hospitalName;
          hospital.status = status;
          hospital.save();
          return res.redirect("/admin");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getDeleteHospital = (req, res) => {
  hospital_id = req.params.id;
  Hospital.deleteOne({ _id: hospital_id })
    .then((result) => {
      return Hospital.find();
    })
    .then((hospitals) => {
      return res.render("admin/hospital", {
        pageTitle: "Hospital List",
        link: "/admin/hospitals",
        hospitals: hospitals,
      });
    })
    .catch((err) => console.log(err));
};

exports.getUsers = (req, res) => {
  succ = req.session.success ? req.session.succ : "";
  err = req.session.error ? req.session.error : "";
  User.find({ userType: "normal" })
    .select("_id firstName lastName email photoUrl")
    .then((user) => {
      res.render("admin/user", {
        succ: succ,
        err: err,
        pageTitle: "Users",
        link: "/admin/user",
        user: user,
      });
    });
};

exports.resetPassword = (req, res) => {
  userId = req.params.id;
  bcript.hash("12345", 12, (err, hashedPassword) => {
    User.findById(userId)
      .then((user) => {
        if (user) {
          user.password = hashedPassword;
          return user.save();
        } else return null;
      })
      .then((user) => {
        if (user) {
          req.session.success = "Sucess";
        } else {
          req.session.error = "Unable to reset password";
        }
        res.redirect("/admin/user");
      })
      .catch((err) => console.log(err));
  });
};

exports.deleteUser = (req, res) => {
  userId = req.params.id;
  User.deleteOne({ _id: userId }).then((user) => {
    req.session.success = "Sucess";
    res.redirect("/admin/user");
  });
};
