const Hospital = require("../model/Hospital");
const { listDoctors, listDoctorsByName } = require("../utility/doctor");
const { listHospital } = require("../utility/hospital");
const { getDepartment } = require("../utility/department");
const Notification = require("../model/Notification");
const {
  listAppointment,
  listAppointmentByDoctorId,
  listAppointmentsByHospitalId,
  checkForUserAppointment,
  checkAppointmentExists,
  bookUserAppointment,
  userAppointments,
  listAppointmentDepartment,
  deleteBookedAppointment,
} = require("../utility/appointment");

const { changePassword } = require("../utility/user");
const BookAppointment = require("../model/BookedAppointment");

exports.getAppointment = (req, res) => {
  const doctor = req.body.doctor;
  const hospital = req.body.hospital;
  const department = req.body.department;
  const hospital_id = req.body.hospitalId;
  const doctor_id = req.body.doctorId;
  if (department) {
    listAppointmentDepartment(department, (app) => {
      console.log("yes");
      if (app) {
        res.json(app);
      } else {
        res.json([]);
      }
    });
  } else if (hospital_id) {
    return listAppointmentsByHospitalId(hospital_id, (app) => {
      if (app) {
        res.json(app);
      } else {
        res.json([]);
      }
    });
  } else if (doctor_id) {
    listAppointmentByDoctorId(doctor_id, (appointment) => {
      if (appointment) {
        res.json(appointment);
      } else {
        res.json([]);
      }
    });
    // return listHospital(doctor_id, (hospitals) => {
    //   if (hospitals) return res.status(200).json(hospitals);
    //   return res.status(200).json({
    //     hospitals: [],
    //   });
    // });
  } else
    return listAppointment(doctor, hospital, department, (app) => {
      if (app) {
        {
          console.log("asa");
          return res.json(app);
        }
      }
      res.json([]);
    });
};

exports.getDoctor = (req, res) => {
  doctorName = req.body.doctor;
  let fName;
  let lName;
  if (!doctorName) {
    console.log("yes");
    return listDoctors((doctors) => {
      if (doctors) return res.json(doctors);
      return res.json([]);
    });
  } else {
    if (doctorName.split.length > 1) {
      fName = doctorName.split(" ")[0];
      lName = doctorName.split("")[1];
    } else {
      fName = doctorName;
      lName = "";
    }
    listDoctorsByName(fName, lName, (doctors) => {
      if (doctors) return res.json(doctors);
      else return res.json([]);
    });
  }
};

exports.getHospital = (req, res) => {
  user = req.user._id;
  const hospitalName = req.body.hospitalName;
  listHospital(hospitalName, user, (hospitals) => {
    if (hospitals) return res.status(200).json(hospitals);
    return res.status(200).json({
      hospitals: [],
    });
  });
};

exports.getDepartment = (req, res) => {
  const departmentName = req.body.department;

  getDepartment(departmentName, (dept) => {
    if (!dept) return res.json([]);
    return res.json(dept);
  });
};

exports.getAppointmentDoctor = (req, res) => {
  doctor_id = req.body.doctorId;
  listAppointmentByDoctorId(doctor_id, (app) => {
    if (app) {
      res.json(app);
    } else {
      res.json([]);
    }
  });
};

exports.getAppointmentHospital = (req, res) => {
  hospital_id = req.body.hospitalId;
  console.log(hospital_id);
  listAppointmentsByHospitalId(hospital_id, (app) => {
    if (app) {
      res.json(app);
    } else {
      print(err);
      res.json([]);
    }
  });
};

exports.postBookAppointment = (req, res) => {
  const userId = req.user._id;
  const appId = req.body.appointmentId;
  checkAppointmentExists(appId, (exists) => {
    console.log(exists);
    if (exists) {
      checkForUserAppointment(userId, appId, (err, exist) => {
        if (!err) {
          if (!exist) {
            bookUserAppointment(userId, appId, (err, app) => {
              if (!err)
                return res.json({
                  success: "Successfully booked appointment",
                });
              else res.json({ err: "Unable to book appointment" });
            });
          } else {
            res.json({
              err: "Appointment already booked",
            });
          }
        } else {
          res.status(500).json({
            err: "Server error",
          });
        }
      });
    } else {
      res.status(300).json({
        err: "Appointment doesn't exists",
      });
    }
  });
};

exports.getUser = (req, res) => {
  return res.json(req.user);
};

exports.getBookedAppointment = (req, res) => {
  user = req.user._id;
  userAppointments(user, (app) => {
    if (app) return res.json({ app: app });
    return res.status(500).json({ err: "Unable to get appointment" });
  });
};

exports.postLike = (req, res) => {
  const hospitalId = req.body.hospitalId;
  const userID = req.user["_id"];
  Hospital.findById(hospitalId)
    .then((hospital) => {
      if (!hospital.likes) {
        hospital.likes = [];
      }
      if (hospital.likes.length == 0) {
        like = {
          like: true,
          user: userID,
        };
        hospital.likes.push(like);
        return hospital.save();
      } else if (
        hospital.likes.filter((element) => element.user == userID).length == 0
      ) {
        like = {
          like: true,
          user: userID,
        };
        hospital.likes.push(like);
        return hospital.save();
      }
      hospital.likes.forEach((element) => {
        if (element.user == userID) {
          console.log(element);

          if (element.like) {
            hospital.like = hospital.like - 1;
          } else {
            hospital.like = hospital.like + 1;
          }
          element.like = !element.like;
        }
      });
      return hospital;
    })
    .then((data) => {
      data.save();
      res.json("success");
    });
};

exports.getNotification = async (req, res) => {
  // Notification.aggregate([{ $match: { user: req.user._id } }])
  Notification.find({ user: req.user._id })
    .populate({
      path: "appointment",
      populate: {
        path: "appointmentId",
        select: "hospital department date startTime",
        populate: { path: "department hospital", select: "hospitalName name" },
        // populate: { path: "hospital", select: "hospitalName" },
      },
    })
    .then((not) => {
      if (not) res.json(not);
      else res.json([]);
    });
};

exports.deleteNotification = async (req, res) => {
  notId = req.body.notificationId;
  Notification.deleteOne({ _id: notificationId }).then((data) =>
    res.json("sucess")
  );
};

exports.deleteBookedAppointment = (req, res) => {
  bookedId = req.body.bookedId;
  deleteBookedAppointment(bookedId, (err, data) => {
    if (!err) return res.json({ success: data });
    else return res.json({ error: data });
  });
};

// change user password
exports.postChangePassword = (req, res) => {
  user = req.user._id;
  password = req.body.password;
  changePassword(password, user, (err, succ) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ success: succ });
    }
  });
};
