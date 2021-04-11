const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  appointment: {
    type: mongoose.Types.ObjectId,
    ref: "BookedAppointment",
  },
  startTime: String,

  approved: Boolean,
  seen: {
    default: false,
    type: Boolean,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
