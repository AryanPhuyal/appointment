const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String
  },
  status: Boolean,
  description: String,
  hospital: {
    type: mongoose.Types.ObjectId,
    ref: "Hospital"
  }
});

module.exports = mongoose.model("Department", departmentSchema);
