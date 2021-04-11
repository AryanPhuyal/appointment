const {
  getAppointment,
  getDepartment,
  getDoctor,
  getHospital,
  getUser,
  postBookAppointment,
  getBookedAppointment,
  postLike,
  getNotification,
  postChangePassword,
  deleteBookedAppointment,
  deleteNotification,
} = require("../controller/user");
const router = require("express").Router();

// @optional doctors first Name, doctors Last Name
// gives json response with related documents
//
router.post("/doctors", getDoctor);
//
router.post("/departments", getDepartment);
// @optional hospital name
router.post("/hospitals", getHospital);
// @ optional appointment Name
router.post("/appointments", getAppointment);
// router.post("/appointments-doctor", getAppointmentDoctor);
// router.post("/appointments-hospital", getAppointmentHospital);
router.get("/users", getUser);

router.post("/book-appointment", postBookAppointment);
router.get("/book-appointment", getBookedAppointment);
router.post("/like", postLike);
router.post("/delete-appointment", deleteBookedAppointment);
router.get("/notification", getNotification);
router.post("/change-password", postChangePassword);
router.post("/delete-notification", deleteNotification);
module.exports = router;
