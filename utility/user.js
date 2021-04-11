const User = require("../model/User");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, cb) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const dateOfBirth = req.body.dateOfBirth;
  const phoneNo = req.body.phoneNo;
  const gender = req.body.gender;
  const country = req.body.county;
  const city = req.body.city;

  bcrypt.hash(password, 12, (err, hashedPassword) => {
    if (!err) {
      return User.find({ email: email })
        .then((user) => {
          if (user.length == 0) {
            let user = User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hashedPassword,
              dateOfBirth: dateOfBirth,
              phoneNumber: phoneNo,
              gender: gender,
              city: city,
              country: country,
            });
            // if (user.length == 0) {
            //   user.userType = "admin";
            // }
            return user.save();
          }
          return;
        })
        .then((data) => {
          if (data) cb(null, "Sucessfully created user");
          cb("Email Exists", null);
        })
        .catch((err) => {
          cb(500, null);
        });
    }
  });
};

exports.changePassword = async (newPassword, user, cb) => {
  User.findById(user)
    .then(async (usr) => {
      if (usr) {
        bcrypt.hash(newPassword, 12, async (err, hashedPassword) => {
          if (!err) {
            usr.password = hashedPassword;
            await usr.save();
            cb(null, "success");
          } else cb("something went wrong");
        });
      } else {
        cb("No user found", null);
      }
    })
    .catch();
};
//   bcrypt
//     .hash(password, 12)
//     .then(hashedPassword => {
//       return User.find().then(data => {
//         let user = User({
//           firstName: firstName,
//           lastName: lastName,
//           email: email,
//           password: hashedPassword,
//           dateOfBirth: dateOfBirth,
//           phoneNumber: phoneNo,
//           gender: gender,
//           city: city,
//           country: country
//         });
//         if (data.length == 0) {
//           user.userType = "admin";
//         }
//         return user;
//       });
//     })
//     .then(user => {
//       return user.save();
//     })
//     .then(user => {
//       return cb();
//       //   return res.redirect("/auth/login");
//     })
//     .catch(err => console.log(err));
// };
