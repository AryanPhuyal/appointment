const User = require("../model/User");
const Appointment = require("../model/Appointment");
exports.listDoctors = (cb) => {
  User.find({ userType: "doctor" })
    .select(
      "firstName lastName email gender city qualification department hospital photoUrl"
    )
    .populate({
      path: "hospital",
      select: "_id hospitalName",
    })
    .populate({
      path: "department",
    })
    // .populate("department")
    .exec((err, doctor) => {
      doctor = doctor.filter((d) => d.hospital != null);
      if (!err) return cb(doctor);
      else cb(null);
    });
};

exports.listDoctorsByFirstName = (fName, cb) => {
  User.find({ userType: "doctor", firstName: fName }, (err, doctor) => {
    if (!err) return cb(doctor);
    else cb(null);
  });
};

exports.listDoctorsByName = async (fName, lName, cb) => {
  User.find(
    { userType: "doctor", firstName: fName, lastName: lName },
    (err, doctor) => {
      if (!err) {
        this.listDoctorsByFirstName(fName, (allDoctors) => {
          return cb(doctor.concat(allDoctors));
        });
        return cb(doctor);
      } else cb(null);
    }
  );
};

exports.deleteDoctor = (doctorId, cb) => {
  Promise.all([Appointment.find({ doctor: doctorId }), User.findById(doctorId)])
    .then(([appointments, doctor]) => {
      if (doctor) {
        if (appointments.length == 0) {
          return User.deleteOne({ _id: doctorId });
        }
        return cb("Doctor has appointment", null);
      } else {
        return cb("No doctor found", null);
      }
    })
    .then((data) => {
      if (data) cb(null, "success");
    })
    .catch((err) => cb(err, null));
};
