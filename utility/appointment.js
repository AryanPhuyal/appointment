const Appointment = require("../model/Appointment");
const BookAppointment = require("../model/BookedAppointment");

exports.listAppointment = async (
  doctor_name,
  hospital_name,
  department,
  cb
) => {
  if (!doctor_name && !hospital_name && !department) {
    await Appointment.find()
      .populate({
        path: "hospital",
        select: "hospitalName"
      })
      .populate({
        path: "department"
      })
      .populate({
        path: "doctor",
        select: "_id firstName lastName email gender qualification department"
      })
      .exec((err, app) => {
        if (!err) {
          app = app.filter(
            a => a.hospital != null && a.department != null && a.doctor != null
          );
          return cb(app);
        }
        return cb(null);
      });
  } else if (!doctor_name && !hospital_name)
    return this.listAppointmentDepartment(department, cb);
  else if (!doctor_name && !department)
    return listAppointment_hospital(hospital_name, cb);
  else if (!hospital_name && !department)
    return listAppointment_Doctor(doctor_name, cb);
  else if (!department)
    return listAppointment_Doctor_hospital(doctor_name, hospital_name, cb);
};

listAppointment_Doctor = async (doctor_name, cb) => {
  console.log(doctor_name);
  return Appointment.find()
    .populate({
      path: "hospital",
      select: "hospitalName"
    })
    .populate({
      path: "department"
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department",
      match: { firstName: doctor_name }
    })
    .exec((err, app) => {
      app = app.filter(
        a => a.hospital != null && a.department != null && a.doctor != null
      );
      if (!err) {
        app = app.filter(a => {
          return a.doctor != null;
        });
        return cb(app);
      }
      return cb(null);
    });
};

listAppointment_hospital = async (hospital_name, cb) => {
  console.log("only-hospital");
  await Appointment.find()
    .populate({
      path: "hospital",
      select: "hospitalName",
      match: { hospitalName: hospital_name }
    })
    .populate({
      path: "department"
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department"
    })
    .exec((err, app) => {
      if (err) {
        app = app.filter(
          a => a.hospital != null && a.department != null && a.doctor != null
        );
        app = app.filter(a => a.doctor != null);
        return cb(null);
      }
      return cb(app);
    });
};

listAppointment_Doctor_hospital = async (doctor_name, hospital_name, cb) => {
  console.log("hospital and doctor");
  await Appointment.find()
    .populate({
      path: "hospital",
      select: "hospitalName",
      match: { hospitalName: hospital_name }
    })
    .populate({
      path: "department"
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department",
      match: { firstName: doctor_name }
    })
    .exec((err, app) => {
      if (!err) {
        app = app.filter(
          a => a.hospital != null && a.department != null && a.doctor != null
        );
        app = app.filter(a => (a.hospital = !null && a.doctor != null));
        return cb(app);
      } else return cb(null);
    });
};

exports.listAppointmentDepartment = async (department, cb) => {
  await Appointment.find()
    .populate({
      path: "hospital",
      select: "hospitalName"
    })
    .populate({
      path: "department",
      match: { name: new RegExp("\\b" + department + "\\b", "i") }
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department"
    })
    .exec((err, app) => {
      if (!err) {
        app = app.filter(
          a => a.hospital != null && a.department != null && a.doctor != null
        );
        app = app.filter(a => a.department != null);
        return cb(app);
      }
      return cb(null);
    });
};

exports.listAppointmentsByHospitalId = async (hospitalId, cb) => {
  console.log("yes");
  await Appointment.find({ hospital: hospitalId })
    .populate({
      path: "hospital",
      select: "hospitalName"
    })
    .populate({
      path: "department"
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department"
    })
    .exec((err, app) => {
      if (!err) {
        app = app.filter(
          a => a.hospital != null && a.department != null && a.doctor != null
        );
        app = app.filter(a => a.appointmentId != null);
        return cb(app);
      }
      return cb(null);
    });
};

exports.listAppointmentByDoctorId = async (doctor_id, cb) => {
  await Appointment.find({ doctor: doctor_id })
    .populate({
      path: "hospital",
      select: "hospitalName"
    })
    .populate({
      path: "department"
    })
    .populate({
      path: "doctor",
      select: "_id firstName lastName email gender qualification department"
    })
    .exec((err, app) => {
      app = app.filter(
        a => a.hospital != null && a.department != null && a.doctor != null
      );
      if (!err) {
        return cb(app);
      }
      return cb(null);
    });
};

exports.checkAppointmentExists = (appId, cb) => {
  Appointment.findById(appId).exec((err, app) => {
    if (app) {
      if (
        app.hospital != null ||
        app.department == null ||
        app.doctor != null
      ) {
        return cb(true);
      }
      return cb(false);
    } else return cb(false);
  });
};

exports.checkForUserAppointment = (user, appId, cb) => {
  console.log(appId);
  Promise.all([
    Appointment.findById(appId),
    BookAppointment.find({ userId: user })
  ])
    .then(([app, userApp]) => {
      // console.log(userApp);
      if (userApp.length == 0) {
        return cb(null, false);
      } else if (
        userApp.filter(a => {
          console.log(a["appointmentId"] == appId);
          return a.appointmentId + "" == appId + "";
        }).length == 0
      ) {
        return cb(null, false);
      }
      // else if (userApp.filter((a) => a.approved).length == 0) {
      //   return cb(null, false);
      // } else if (
      //   userApp.filter((a) => {
      //     aDate = a.date;
      //     appointmentDate = Appointment.date;
      //     diff = Math.abs(aDate - appointmentDate);
      //     return diff > 86400000;
      //   }).length == 0
      // ) {
      //   return cb(null, false);
      // }
      else {
        cb(null, true);
      }
    })
    .catch(err => {
      return cb("Error on connection", null);
    });
};

exports.bookUserAppointment = (user, appId, cb) => {
  const app = BookAppointment({
    userId: user,
    appointmentId: appId
  });
  app
    .save()
    .then(app => cb(null, app))
    .catch(err => cb(err, null));
};

exports.userAppointments = (user, cb) => {
  BookAppointment.find({ userId: user, enable: true })
    .populate({
      path: "appointmentId",
      populate: {
        path: "doctor department hospital",
        select: "firstName lastName email name hospitalName phone"
      }
    })

    .exec((err, app) => {
      if (!err) {
        app = app.filter(a => a.appointmentId !== null);
        return cb(app);
      } else return cb(null);
    });
};

exports.getHospitalAppointment = (hospitalId, cb) => {
  BookAppointment.find({ status: "pending" })

    .populate({
      path: "appointmentId",
      select: "_id appointmentId hospital date startTime endTime",
      match: { hospital: hospitalId }
    })
    .populate({
      path: "userId",
      select: "firstName lastName _id email"
    })
    .exec((err, data) => {
      if (!err) {
        data = data.filter(a => a.userId != null);
        data = data.filter(a => a.userId != null || a.appointmentId != null);

        data = data.filter(d => d["appointmentId"] != null);
        console.log(data);
        cb(data);
      } else cb(null);
    });
};

// approved users only

exports.getUserAppointment = (hospitalId, cb) => {
  BookAppointment.find({ status: "approved" })

    .populate({
      path: "appointmentId",
      select: "_id appointmentId hospital date startTime endTime",
      match: { hospital: hospitalId }
    })
    .populate({
      path: "userId",
      select: "firstName lastName _id email"
    })
    .exec((err, data) => {
      if (!err) {
        data = data.filter(a => a.userId != null || a.appointmentId != null);
        data = data.filter(a => a.appointmentId != null);

        // data = data.filter((d) => d["appointmentId"] != null);
        console.log(data);
        cb(data);
      } else cb(null);
    });
};

// appointment status change
// if allow approve appointmet
// if !allow deny appointment
exports.approveAppointment = (id, userId, allow, cb) => {
  BookAppointment.findOne({ _id: id, userId: userId })
    .populate({ path: "appointmentId" })
    .then(app => {
      if (app.length <= 0) {
        return cb("No appointment booked with this data", null);
      } else {
        app["status"] = allow ? "approved" : "deny";
        app["approved"] = allow;
        console.log(app);
        app
          .save()
          .then(app => {
            return cb(null, app);
          })
          .catch(err => cb("Unable to save change", null));
      }
    })
    .catch(err => cb(err, null));
};

exports.deleteAppointment = (appId, cb) => {
  Promise.all([
    BookAppointment.find({ appointmentId: appId }),
    Appointment.findById(appId)
  ])
    .then(([userApp, app]) => {
      console.log(userApp);
      console.log(app);
      if (userApp.length == 0) {
        return Appointment.deleteOne({ _id: appId });
      } else {
        cb(null, "User exists");
      }
    })
    .then(data => cb(null, "Deleted"))
    .catch(err => {
      console.log(err);
      cb(err, null);
    });
};

exports.deleteBookedAppointment = (bookedAppId, cb) => {
  BookAppointment.findById(bookedAppId)
    .then(app => {
      if (app) {
        if (app.status == "pending" || app.status == "deny") {
          return BookAppointment.deleteOne({ _id: bookedAppId });
        } else return null;
      } else {
        return 0;
      }
    })
    .then(data => {
      if (data == 0) {
        cb("Appointment dosent found", null);
      } else if (!data) {
        cb("Appointment already approved", null);
      } else {
        cb(null, "sucess");
      }
    })
    .catch(err => cb(err, null));
};
