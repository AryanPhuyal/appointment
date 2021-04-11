const router = require("express").Router();
const { upload } = require("../middleware/multer");
// const hospitalMiddleWare = require("../middleware/is_hospital");
const {
  getIndex,
  getAddDoctor,
  getAppointment,
  getEditDoctor,
  postAddDoctor,
  postEditDoctor,
  getDepartment,
  getAddDepartment,
  postAddDepartment,
  getAddAppointment,
  postAddAppointment,
  getDeleteAppointment,
  getChangeStatus,
  getPatients,
  allowAppointment,
  denyAppointment,
  getEditHospital,
  postEditHospital,
  getApproveAppointment,
  getDeleteDoctor,
} = require("../controller/hospital");

// validation files
const {
  emailValidation,
  firstName,
  passwordValidation,
  phoneValidation,
  editEmailValidation,
} = require("../validation/validation");

const {
  idValidation,
  doctorValidation,
  departmentValidation,
  StatusValidation,
  dateValidation,
  startTimeValidation,
  endTimeValidation,
} = require("../validation/appointment");

router.get("/", getIndex);

router.get("/add-doctor", getAddDoctor);

router.post(
  "/add-doctor",
  upload.single("profile"),
  firstName,
  emailValidation,
  passwordValidation,
  phoneValidation,
  postAddDoctor
);

router.get("/appointments", getAppointment);
router.get(
  "/edit-doctor/:id",

  getEditDoctor
);
router.post(
  "/edit-doctor",
  upload.single("profile"),
  firstName,
  // editEmailValidation,
  // passwordValidation,
  // phoneValidation,
  postEditDoctor
);

router.get("/department", getDepartment);
router.get("/add-department", getAddDepartment);
router.post("/add-department", postAddDepartment);
router.get("/add-appointment", getAddAppointment);
router.get(
  "/delete-appointment/:appID",

  getDeleteAppointment
);

router.get("/change-status/:appID", getChangeStatus);

router.post(
  "/add-appointment",
  idValidation,
  doctorValidation,
  departmentValidation,

  StatusValidation,
  dateValidation,
  startTimeValidation,
  endTimeValidation,
  postAddAppointment
);

router.post("/patients/allow", allowAppointment);

router.post("/patients/deny", denyAppointment);

router.get("/patients", getPatients);
router.get("/approved-patients", getApproveAppointment);
router.get("/delete-doctor/:doctorId", getDeleteDoctor);

router.get("/edit", getEditHospital);
router.post("/edit", upload.single("profile"), postEditHospital);

module.exports = router;
