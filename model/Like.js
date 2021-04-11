const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    hospital: {
        type: mongoose.Types.ObjectId,
    },
    like:
    {
        type: Boolean,
        default: false,
    }
})
module.exports = mongoose.model("Like", LikeSchema);
