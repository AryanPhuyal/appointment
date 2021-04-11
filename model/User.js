const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  gender: {
    type: String
  },
  city: {
    type: String
  },
  country: String,
  userType: {
    type: String,
    default: "normal"
  },
  status: String,
  photoUrl: {
    type: String,
    default: "/uploads/no-profile.png"
  },
  qualification: String,
  hospital: {
    type: mongoose.Types.ObjectId,
    ref: "Hospital"
  },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department"
  }
});

module.exports = mongoose.model("User", UserSchema);
