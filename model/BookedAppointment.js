const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookedAppointmentSchema = new Schema({
  appointmentId: {
    type: mongoose.Types.ObjectId,
    ref: "Appointment"
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  bookedTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "pending"
  },
  display: {
    type: Boolean,
    default: true
  },
  enable: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedTime: Date
});

module.exports = mongoose.model("BookedAppointment", bookedAppointmentSchema);
