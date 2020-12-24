const router = require("express").Router();
const { verify } = require("jsonwebtoken");
const { auth } = require("../../middleware/auth");
const {
  createUser,
  login,
  sendRequest,
  checkRequest,
  sendToken,
  checkLand,
  checkToken,
  getDistrictByProvince,
  getLandByDistrictId
} = require("./user.controller");
router.post("/", createUser);
router.post("/login", login);
router.post("/request", sendRequest);
router.post("/checkRequest", checkRequest);
router.post("/getToken", sendToken);
router.post("/checkLand", checkLand);
router.post("/viewBalance", checkToken);
router.post("/getDistrictById", getDistrictByProvince)
router.post("/getLandByDistrictId", getLandByDistrictId);
module.exports = router;
