const {
  getAdmin,
  createAdmin,
  getAdminByEmail,
  getAdminRequests,
  acceptRequest,
  rejectRequest,
  addProvince,
  addDistrict,
  addLand,
  setLandRequestId,
  getDistrict
} = require("./admin.service");
const {
  getDistrictById,
  getProvinceById,
  getLandById,
} = require("../users/user.service");
const { hashSync, genSaltSync, compareSync, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const web = require("../../utils/functions");
const crypto = require("crypto");
const ENCRYPTION_KEY = "UVbUPxSGxaB2nD7TxpHyxZ5suyzjAgMx"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
function sha256AsHexString(doc) {
  return (
    "0x" +
    crypto
      .createHash("sha256")
      .update(doc, "utf8")
      .digest("hex")
  );
}

function encrypt(doc) {
  var mykey = crypto.createCipher("aes-128-cbc", "mypassword");
  var mystr = mykey.update(doc, "utf8", "hex");
  mystr += mykey.final("hex");
  return mystr;
}

function newEncrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}
function newDecrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = {
  login: async (req, res) => {
    try {
      const body = req.body;
      const admin = await getAdmin(body.email);
      if (!admin) {
        return res.status(403).send({
          success: 0,
          message: "invalid login credentials",
          data: null,
        });
      }
      const result = compareSync(body.password, admin.password);
      if (result) {
        admin.password = undefined;
        const jsontoken = sign({ result: admin }, "blocktrade");
        return res.json({
          success: 1,
          message: "login successfully",
          data: null,
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          message: "Invalid login credentials",
          data: null,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 1,
        message: "error in admin login",
        data: null,
      });
    }
  },
  adminSignup: async (req, res) => {
    try {
      let body = req.body;
      const admin = await getAdminByEmail(body.email);
      if (admin) {
        return res.status(302).send({
          success: 0,
          message: "Email already exists",
          data: null,
        });
      }
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      await createAdmin(body);
      return res.status(201).send({
        success: 1,
        message: "admin created",
        data: null,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in creating admin",
        data: null,
      });
    }
  },
  checkRequest: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const requests = await getAdminRequests();
      if (!requests.length) {
        return res.status(404).send({
          success: 1,
          message: "no requests found",
          data: null,
        });
      }
      let requestsArray = [];
      let result = [];
      let toShow = [];
      for (let i = 0; i < requests.length; i++) {
        toShow.push({});
        requestsArray[i] = await web.checkRequest(requests[i].request_id);
        console.log(requestsArray[i]);
        // var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
        // var mystr1 = mykey.update(requestsArray[i][4], "hex", "utf8");
        // mystr1 += mykey.final("utf8");
        let mystr1 = newDecrypt(requestsArray[i][4]);
        result[i] = mystr1.split(",");
        result[i].pop();
        toShow[i].email = result[i][0];
        toShow[i].requestId = result[i][1];
        toShow[i].reason = result[i][2];
        toShow[i].land = result[i][3];
        toShow[i].landId = result[i][4];
        toShow[i].district = result[i][5];
        toShow[i].province = result[i][6];
        toShow[i].transfer = result[i][7];
        let landDetails = await getLandById(result[i][4]);
        let obj = {
          land: `${landDetails.land_no} ${landDetails.block} ${landDetails.area}`,
          district: result[i][5],
          province: result[i][6],
          owner: result[i][7],
        };
        toShow[i].newHash = sha256AsHexString(Object.values(obj).join(""));
        // let newEncryption = {
        //   email: result[i][0],
        //   requestId: result[i][1],
        //   reason: result[i][2],
        //   land: `${landDetails.land_no} ${landDetails.block} ${landDetails.area}`,
        //   landId: result[i][4],
        //   district: result[i][5],
        //   province: result[i][6],
        //   ownership: result[i][7],
        // };
        // const arrayObj = Object.values(newEncryption);
        // for (let j = 0; j < arrayObj.length; j++) {
        //   arrayObj[j] = arrayObj[j] + ",";
        //   console.log(arrayObj[j]);
        // }
        // const resultStr = arrayObj.join("");
        // toShow[i].newEncrypted = newEncrypt(resultStr);
      }
      let hashing;
      let landRequestId;
      for (let i = 0; i < result.length; i++) {
        landRequestId = await getLandById(result[i][4]);
        hashing = await web.checkRequest(landRequestId.request_id);
        if (hashing[5] == requestsArray[i][5]) {
          requestsArray[i][6] = "correct";
          toShow[i].hash = "correct";
        } else {
          requestsArray[i][6] = "incorrect";
          toShow[i].hash = "incorrect";
        }
      }
      return res.status(202).send({
        success: 1,
        message: "succesfully got request",
        data: toShow,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in checking requests",
        data: null,
      });
    }
  },
  acceptRequest: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const requests = await web.acceptRequest(body.Rid, body.hash);
      if (!requests) {
        return res.status(500).send({
          success: 0,
          message: "blockchain error in accepting requests",
          data: null,
        });
      }
      await setLandRequestId(body);
      await acceptRequest(body.Rid);
      return res.status(202).send({
        success: 1,
        message: "succesfully accepted request",
        data: null,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in accepting requests",
        data: null,
      });
    }
  },
  rejectRequest: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const requests = await web.rejectRequest(body.Rid);
      if (!requests) {
        return res.status(500).send({
          success: 0,
          message: "blockchain error in rejecting request",
          data: null,
        });
      }
      await rejectRequest(body.Rid);
      return res.status(202).send({
        success: 1,
        message: "succesfully rejected request",
        data: null,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in rejecting requests",
        data: null,
      });
    }
  },
  addDistrict: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await addDistrict(body);
      return res.status(202).send({
        success: 1,
        message: "succesfully added District",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in adding District",
        data: null,
      });
    }
  },
  addLand: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const getGlobal = await web.getGlobalId();
      body.request_id = getGlobal;
      const district = await getDistrictById(body.district_id);
      const province = await getProvinceById(district.province_id);
      const result = {
        requestId: getGlobal,
        land: `${body.land_no} ${body.block} ${body.area}`,
        district: `${district.name}`,
        province: `${province.name}`,
      };
      const landObj = {
        land: `${body.land_no} ${body.block} ${body.area}`,
        district: `${district.name}`,
        province: `${province.name}`,
        owner: `${body.owner_key}`,
      };
      const arrayObj = Object.values(result);
      for (let i = 0; i < arrayObj.length; i++) {
        arrayObj[i] = arrayObj[i] + ",";
        console.log(arrayObj[i]);
      }
      const resultStr = arrayObj.join("");
      const encr = newEncrypt(resultStr);
      const hash = sha256AsHexString(Object.values(landObj).join(""));
      const transaction = await web.sendRequest(
        body.account,
        body.private_key,
        encr,
        hash
      );
      await addLand(body);
      return res.status(202).send({
        success: 1,
        message: "succesfully added District",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in adding District",
        data: null,
      });
    }
  },
  getDistrict: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await getDistrict();
      return res.status(202).send({
        success: 1,
        message: "succesfully got request",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in getting districts",
        data: null,
      });
    }
  },
};
