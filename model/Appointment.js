const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  appointmentId: String,
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department"
  },
  hospital: {
    type: mongoose.Types.ObjectId,
    ref: "Hospital"
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  date: String,
  startTime: String,
  endTime: String,
  status: Boolean,
  Expires: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model("Appointment", appointmentSchema);
