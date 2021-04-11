const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

hospitalSchema = new Schema( {
  userName: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  accountStatus: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String,
    default: "hospital"
  },
  hospitalName: String,
  description: String,
  phone: String,
  status: String,
  numberOfAppointments: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: "/uploads/hospital.jpg"
  },
  like: {
    type: Number,
    default: 0
  },
  likes: [
    {
      user: {
        type: mongoose.Types.ObjectId,
      },
      like: {
        type: Boolean,
        default: false
      }

    }
  ]



} );
module.exports = mongoose.model( "Hospital", hospitalSchema );
