const { body } = require("express-validator");
const User = require("../model/User");
const Hospital = require("../model/Hospital");
const Department = require("../model/Department");
const mongoose = require("mongoose");
const date = require("date-and-time");

exports.idValidation = [
  body("appointmentId").custom((value, { req }) => {
    r = /\w+-+\d/;
    if (!r.test(value)) {
      throw new Error("Appointment Id is not Valid");
    }
    return true;
  })
];
exports.departmentValidation = [
  body("department").custom((value, { req }) => {
    departmentId = value.split(" ")[0];
    req.body.department = departmentId;
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      throw new Error("Department is not valid");
    }
    return true;
  })
];
exports.doctorValidation = [
  body("doctor").custom((value, { req }) => {
    doctorId = value.split(" ")[0];
    req.body.doctor = doctorId;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error("Doctor is not valid");
    }
    return true;
  })
];
exports.dateValidation = [
  body("date").custom((value, { req }) => {
    if (!date.isValid(value, "DD/MM/YYYY")) {
      throw new Error("Date is not valid");
    }
    appDate = new Date(value);
    cDate = Date.now();
    if (appDate < cDate) {
      throw new Error("Date is not valid. Date is expired");
    }
    return true;
  })
];

exports.startTimeValidation = [
  body("startTime").custom((value, { req }) => {
    value = convertTimeTo24Hr(value);
    startTime = req.body.date + " " + value;
    const dt = date.parse(startTime, "DD/MM/YYYY HH:mm:ss");
    console.log(req.body.date + " " + value);
    console.log(dt);
    if (dt == "Invalid Date") {
      throw new Error("Start time is not valid");
    }
    if (dt < Date.now()) {
      throw new Error("Time is not valid.Time is expired.");
    }
    return true;
  })
];
exports.endTimeValidation = [
  body("endTime").custom((value, { req }) => {
    try {
      startTime = convertTimeTo24Hr(req.body.startTime);
      endTime = convertTimeTo24Hr(value);
    } catch (err) {
      throw new Error("Time is not valid");
    }
    startTime = req.body.date + " " + startTime;
    endTime = req.body.date + " " + endTime;
    const startDt = date.parse(startTime, "DD/MM/YYYY HH:mm:ss");
    const endDt = date.parse(startTime, "DD/MM/YYYY HH:mm:ss");

    if (endDt == "Invalid Date") throw new Error("End Time is not Valid");
    if (startDt > endDt) {
      throw new Error("End time is not Valid");
    }
    return true;
  })
];

convertTimeTo24Hr = time => {
  try {
    APM = time.split(" ")[-1];
    if ((APM = "PM")) {
      hr = time.split(" ")[0].split(":")[0];
      min = time.split(" ")[0].split(":")[1];
      hr = parseInt(hr) + 12;
    }
    value = `${hr}:${min}:33`;
    return value;
  } catch (err) {
    throw new Error("time is not valid");
  }
};

exports.StatusValidation = [
  body("status").custom((value, { req }) => {
    if (value == "active") {
      req.body.status = true;
    } else if (value == "inactive") {
      req.body.status = false;
    } else {
      throw new Error("Please select status for this appointment");
    }
    return true;
  })
];
