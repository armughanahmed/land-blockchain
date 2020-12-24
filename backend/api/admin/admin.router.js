const router = require("express").Router();
const { auth, authModerator } = require("../../middleware/auth");
const {
  adminSignup,
  login,
  checkRequest,
  acceptRequest,
  rejectRequest,
  addProvince,
  addDistrict,
  addLand,
  getDistrict,
} = require("./admin.controller");
router.post("/signup", adminSignup);
router.post("/", login);
router.post("/checkRequest", checkRequest);
router.post("/acceptRequest", acceptRequest);
router.post("/rejectRequest", rejectRequest);
// router.post("/addProvince", addProvince);
router.post("/addDistrict", addDistrict);
router.post("/addLand", addLand);
router.post("/getDistrict", getDistrict);

module.exports = router;
