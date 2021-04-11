const User = require("../model/User");
const { validationResult } = require("express-validator");
const Department = require("../model/Department");
const Appointment = require("../model/Appointment");
const Hospital = require("../model/Hospital");
const bcrypt = require("bcryptjs");
const Notification = require("../model/Notification");

const { deleteDoctor } = require("../utility/doctor");
const {
  getHospitalAppointment,
  approveAppointment,
  getUserAppointment,
  deleteAppointment
} = require("../utility/appointment");

exports.getIndex = (req, res) => {
  const success = req.session.success;
  req.session.success = "";
  const error = req.session.error;
  req.session.error = "";
  User.find({ hospital: req.session.hospital._id })
    .populate("department")
    .then(users => {
      res.render("hospital/doctors", {
        success,
        error,
        pageTitle: "Doctors",
        link: "/hospital",
        doctors: users
      });
    })
    .catch(err => console.log(err));
};

exports.getAddDoctor = (req, res) => {
  let error;
  console.log(req.session.error);
  if (req.session.error) {
    error = error;
  }
  req.session.err = "";
  Department.find({ hospital: req.session.hospital._id }).exec((err, data) => {
    if (!err) {
      console.log(data);
      res.render("hospital/add-doctor", {
        pageTitle: "Doctors",
        link: "/hospital",
        departments: data,
        error: error,
        editing: false
      });
    }
  });
};

exports.postAddDoctor = (req, res) => {
  let photoUrl;
  if (req.file) {
    photoUrl = "/uploads/" + req.file.filename;
  } else {
    photoUrl = "/uploads/no-profile.png";
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return res.status(422).redirect("/hospital/add-doctor");
  }

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const dateOfBirth = req.body.dateOfBirth;
  const phoneNo = req.body.phoneNo;
  const gender = req.body.gender;
  const country = req.body.county;
  const city = req.body.city;
  const department = req.body.department;
  const qualification = req.body.qualification;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      return User.find().then(data => {
        let user = User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          dateOfBirth: dateOfBirth,
          phoneNumber: phoneNo,
          gender: gender,
          city: city,
          country: country,
          userType: "doctor",
          qualification: qualification,
          department: department,
          hospital: req.session.hospital._id,
          photoUrl: photoUrl
        });

        return user;
      });
    })
    .then(user => {
      return user.save();
    })
    .then(user => {
      req.session.success = "Successfully added Doctor";
      return res.redirect("/hospital");
    })
    .catch(err => console.log(err));
};

exports.getEditDoctor = (req, res) => {
  const id = req.params.id;
  error = req.session.error ? req.session.error : "";
  req.session.error = "";
  Promise.all([
    User.findById(id),
    Department.find({ hospital: req.session.hospital["_id"] })
  ])
    .then(([doctor, departments]) => {
      if (doctor) {
        res.render("hospital/add-doctor", {
          editing: true,
          user: doctor,
          error: error,
          departments: departments,
          pageTitle: "Edit Doctor",
          link: "/hospital/add-doctor"
        });
      } else {
        console.log("Doctor dosen't find");
      }
    })
    .catch(err => console.log(err));
};

exports.postEditDoctor = (req, res) => {
  let updatePhoto;
  let photoUrl;
  if (req.file) {
    updatePhoto = true;
    photoUrl = "/uploads/" + req.file.filename;
  } else {
    updatePhoto = false;
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return res.status(422).redirect("/hospital/edit-doctor/" + req.body._id);
  }
  const id = req.body._id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const dateOfBirth = req.body.dateOfBirth;
  const phoneNo = req.body.phoneNo;
  const gender = req.body.gender;
  const country = req.body.county;
  const city = req.body.city;
  const department = req.body.department;
  const qualification = req.body.qualification;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      return User.findById(id).then(user => {
        user._id = id;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = hashedPassword;
        user.dateOfBirth = dateOfBirth;
        user.phoneNumber = phoneNo;
        user.gender = gender;
        user.city = city;
        user.country = country;
        user.qualification = qualification;
        user.department = department;
        if (updatePhoto) {
          user.photoUrl = photoUrl;
        }
        return user;
      });
    })
    .then(user => {
      return user.save();
    })
    .then(user => {
      req.session.success = "Successfully added Doctor";
      return res.redirect("/hospital");
    })
    .catch(err => console.log(err));
};

exports.getDepartment = (req, res) => {
  Department.find({ hospital: req.session.hospital._id })
    .then(departments => {
      res.render("hospital/department", {
        pageTitle: "Department",
        link: "/hospital/department",
        departments: departments
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAddDepartment = (req, res) => {
  res.render("hospital/add-department", {
    pageTitle: "Department",
    link: "/hospital/department",
    error: "",
    editing: false
  });
};

exports.postAddDepartment = (req, res) => {
  name = req.body.departmentName;
  description = req.body.departmentDescription;
  status = req.body.status;
  console.log(status);
  Department.find({ hospital: req.session.hospital._id, departmentName: name })
    .then(department => {
      if (department.length === 0) {
        newDepartment = new Department({
          name: name,
          departmentDescription: description,
          status: status,
          hospital: req.session.hospital._id
        });
        newDepartment.save();
        return res.redirect("/hospital/department");
      } else {
        return res.render("hospital/add-department", {
          pageTitle: "Department",
          link: "/hospital/department",
          error: "Department already exists",
          editing: false
        });
      }
    })
    .catch(err => console.log(err));
};

exports.getAppointment = (req, res) => {
  success = req.session.success ? req.session.success : "";
  error = req.session.error ? req.session.error : "";
  req.session.error = "";
  Appointment.find({ hospital: req.session.hospital._id })
    .populate("doctor department")
    .then(appointments => {
      res.render("hospital/appointments", {
        pageTitle: "Appointments",
        error: error,
        link: "/hospital/appointments",
        appointments: appointments
      });
    })
    .catch();
};

exports.getAddAppointment = (req, res) => {
  error = req.session.error ? req.session.error : "";
  req.session.error = "";
  const appId = req.session.hospital.numberOfAppointments + 1;
  Promise.all([
    User.find({ hospital: req.session.hospital._id }),
    Department.find({ hospital: req.session.hospital._id })
  ])
    .then(([users, departments]) => {
      return res.render("hospital/add-appointment", {
        error: error,
        pageTitle: "Add Appointment",
        link: "/hospital/add-appointment",
        appointmentId: "APN-" + appId,
        departments: departments,
        doctors: users
      });
    })
    .catch(err => console.log(err));
};

// post appointment
exports.postAddAppointment = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    return res.status(300).redirect("/hospital/add-appointment/");
  }
  const hospitalId = req.session.hospital._id;
  const appointmentId = req.body.appointmentId;
  const department = req.body.department;
  const doctor = req.body.doctor;
  const date = req.body.date;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const message = req.body.message;
  const status = req.body.status;
  Promise.all([
    User.findById(doctor),
    Department.findById(department),
    Appointment.find({ appointmentId: appointmentId, hospital: hospitalId })
  ])
    .then(([user, department, appointment]) => {
      if (!user || !department) {
        req.session.error = "Doctor or department not valid";
        return res.status(300).redirect("/hospital/add-appointment/");
      }
      if (appointment.length !== 0) {
        req.session.error = "Appointment with this id already exists";
        return res.status(300).redirect("/hospital/add-appointment/");
      }
      return Appointment({
        appointmentId: appointmentId,
        hospital: req.session.hospital._id,
        department: department,
        doctor: doctor,
        date: date,
        startTime: startTime,
        endTime: endTime,
        message: message,
        status: status
      });
    })
    .then(appointment => {
      if (appointment) {
        return Hospital.findById(req.session.hospital._id).then(hospital => {
          return [hospital, appointment];
        });
      }
    })
    .then(([hospital, appointment]) => {
      if (hospital) {
        hospital.numberOfAppointments += 1;
        req.session.hospital = hospital;
        return hospital.save().then(hospital => {
          return appointment;
        });
      }
    })
    .then(appointment => {
      if (appointment) return appointment.save();
    })
    .then(appointment => {
      if (appointment) return res.redirect("/hospital/appointments");
    })
    .catch(err => console.log(err));
};

exports.getDeleteAppointment = (req, res) => {
  const appId = req.params.appID;
  deleteAppointment(appId, (err, data) => {
    if (!err) {
      if (data == "Deleted  ") {
        req.session.success = "Deleted";
      } else {
        req.session.error = "Patents exists for this appointment";
      }
    } else {
      req.session.error = "Unable to delete this appointment";
    }
    return res.redirect("/hospital/appointments");
  });
};

exports.getChangeStatus = (req, res) => {
  const appId = req.params.appID;
  Appointment.findById(appId)
    .then(app => {
      if (app) {
        console.log(app.status);
        app.status = !app.status;
        return app.save();
      } else {
        throw new Error("1");
      }
    })
    .then(res.redirect("/hospital/appointments"))
    .catch(err => {
      print(err);
      if ((err = "1")) err = "No appointment with this is";
      else err = "Unable to change appointment ststus";
      res.session.error = err;
      res.redirect("/hospital/appointments");
    });
};

exports.getPatients = (req, res, next) => {
  err = req.session.err ? req.session.err : "";
  succ = req.session.success ? req.session.success : "";
  hospital_id = req.hospital._id;
  req.session.err = "";
  req.session.success = "";
  getHospitalAppointment(hospital_id, app => {
    if (app) {
      console.log(app);
      res.render("hospital/patients", {
        err: err,
        pageTitle: "Patients",
        patients: app,
        link: "/hospital/patients"
      });
    }
  });
};

exports.getApproveAppointment = (req, res, next) => {
  hospital_id = req.hospital._id;

  getUserAppointment(hospital_id, app => {
    if (app) {
      // console.log(app);
      res.render("hospital/approved-appointment", {
        pageTitle: "Patients",
        patients: app,
        link: "/hospital/approved-patients"
      });
    }
  });
};

exports.allowAppointment = (req, res) => {
  const userId = req.body.userId;
  const appointmentId = req.body.appointmentId;
  approveAppointment(appointmentId, userId, true, async (err, app) => {
    if (err) {
      req.session["err"] = err;
      res.redirect("/hospital/patients");
    } else {
      let notification = Notification({
        appointment: appointmentId,
        user: userId,
        approved: true
      });
      await notification.save();
      req.session["success"] = "Appointment approved";
      res.redirect("/hospital/patients");
    }
  });
};

exports.denyAppointment = (req, res) => {
  const userId = req.body.userId;
  const appointmentId = req.body.appointmentId;
  approveAppointment(appointmentId, userId, false, async (err, app) => {
    if (err) {
      req.session["err"] = err;
      res.redirect("/hospital/patients");
    } else {
      let notification = Notification({
        appointment: appointmentId,
        user: userId,
        approved: false
      });
      await notification.save();
      req.session["success"] = "Appointment deny";
      res.redirect("/hospital/patients");
    }
  });
};

exports.getEditHospital = (req, res) => {
  hospital = req.session.hospital;
  console.log(hospital);
  res.render("hospital/edit-hospital", {
    pageTitle: "Edit hospital",
    link: "/hospital/edit-hospital",
    error: "",
    editing: true
  });
};

exports.postEditHospital = (req, res) => {
  let photoUrl;
  let addPhoto;
  if (req.file) {
    addPhoto = true;
    photoUrl = "/uploads/" + req.file.filename;
  } else {
    addPhoto = false;
  }
  const hospitalName = req.body.hospitalName;
  const description = req.body.description;
  const location = req.body.location;
  const phone = req.body.phone;
  Hospital.findById(req.session.hospital._id)
    .then(hospital => {
      hospital.hospitalName = hospitalName;
      hospital.description = description;
      hospital.location = location;
      hospital.phone = phone;
      if (addPhoto) {
        hospital.imageUrl = photoUrl;
      }
      return hospital.save();
    })
    .then(hospital => {
      req.session.hospital = hospital;
      res.redirect("/hospital");
    })
    .catch(err => {
      console.log(err);
    });

  if (addPhoto) {
    imageUrl = photoUrl;
  }
};

exports.getDeleteDoctor = (req, res) => {
  doctorId = req.params.doctorId;
  deleteDoctor(doctorId, (err, succ) => {
    console.log(succ);
    console.log(err);
    if (!err) {
      req.session.success = succ;
      return res.redirect("/hospital");
    }
    req.session.error = err;
    return res.redirect("/hospital");
  });
};
