const router = require("express").Router();
const adminMiddleware = require("../middleware/is-admin");

// controller
const {
  getAddHospital,
  postAddHospital,
  getHospitals,
  getEditHospital,
  postEditHospital,
  getDeleteHospital,
  getUsers,
  resetPassword,
  deleteUser,
} = require("../controller/admin");

router.get("/edit-hospital/:hospitalId", adminMiddleware, getEditHospital);
router.get("/add-hospital", adminMiddleware, getAddHospital);
// validation
const {
  hospitalUserName,
  hospitalName,
  hospitalPassword,
} = require("../validation/validation");

router.post(
  "/add-hospital",
  adminMiddleware,
  hospitalUserName,
  hospitalName,
  hospitalPassword,
  postAddHospital
);

router.post(
  "/edit-hospital/:hospital_id",
  adminMiddleware,
  hospitalName,
  hospitalPassword,
  postEditHospital
);
router.get("/delete-hospital/:id", adminMiddleware, getDeleteHospital);
router.get("/", adminMiddleware, getHospitals);
router.get("/user", adminMiddleware, getUsers);
router.get("/reset-password/:id", resetPassword);
router.get("/delete-user/:id", deleteUser);
module.exports = router;
