const Department = require("../model/Department");

// get all department in the database
exports.getDepartment = (name, cb) => {
  if (name) return this.getDepartment_name(cb);
  Department.find((err, departments) => {
    if (!err) return cb(departments);
    return cb(null);
  });
};

getDepartment_name = cb => {
  return Department.find({ name: name }, (err, dept) => {
    if (!err) return cb(dept);
    return cb(null);
  });
};
