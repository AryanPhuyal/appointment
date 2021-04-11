const router = require("express").Router();
const { getIndex } = require("../controller/public");
router.get("/", getIndex);
module.exports = router;
