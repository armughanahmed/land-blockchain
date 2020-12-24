const {
  deleteToken,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getLandById,
  getProvinceById,
  getRequestsByUserId,
  getDistrictById,
  setRequests,
  getDistrict,
  getDistrictByProvince,
  getLandByDistrictId,
} = require("./user.service");
const web = require("../../utils/functions");
const nodemailer = require("nodemailer");
const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign, verify, decode } = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = async (text, to, org) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "usernamae",
      pass: "password",
    },
  });

  let mailOptions = {
    from: "armughancr7@gmail.com",
    to: to,
    subject: "Welcome",
    // cc: org,
    html: `<p>thank you for signing up ${text}</p>`,
  };

  let info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info;
};
const ENCRYPTION_KEY = "UVbUPxSGxaB2nD7TxpHyxZ5suyzjAgMx"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
function sha256AsHexString(doc) {
  return "0x" + crypto.createHash("sha256").update(doc, "utf8").digest("hex");
}

// function encrypt(doc) {
//   var mykey = crypto.createCipher("aes-128-cbc", "mypassword");
//   var mystr = mykey.update(doc, "utf8", "hex");
//   mystr += mykey.final("hex");
//   return mystr;
// }

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
  createUser: async (req, res) => {
    try {
      const body = req.body;
      const userEmail = await getUserByUserEmail(body.email);
      if (userEmail) {
        return res.status(302).send({
          success: 0,
          message: "Email already exists",
          data: null,
        });
      }
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      await createUser(body);
      const mail = sendEmail(body.name, body.email);
      if (!mail) {
        console.log("createUser:: error in sending mail");
      }
      return res.status(200).send({
        success: 1,
        message: "succesfully created",
        data: userEmail,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "Something went wrong while creating user",
        data: null,
      });
    }
  },
  login: async (req, res) => {
    try {
      const body = req.body;
      const user = await getUserByUserEmail(body.email);
      if (!user) {
        return res.status(403).send({
          success: 0,
          message: "invalid login credentials",
          data: null,
        });
      }
      const result = compareSync(body.password, user.password);
      if (result) {
        user.password = undefined;
        const jsontoken = sign({ result: user }, "blocktrade");
        return res.status(200).send({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      } else {
        return res.status(400).send({
          success: 0,
          message: "Invalid login credentials",
          data: null,
        });
      }
    } catch (e) {
      return res.status(500).send({
        success: 0,
        message: "Invalid login credentials",
        data: null,
      });
    }
  },
  getUserByUserId: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await getUserByUserId(id);
      if (!user) {
        return res.status(404).send({
          success: 0,
          message: "user not found",
        });
      }
      user.password = undefined;
      return res.status(200).send({
        success: 1,
        message: "user found succesfully",
        data: user,
      });
    } catch (e) {
      console.log(e);
      return res.status(200).send({
        success: 0,
        message: "something went wrong while finding users by user id",
        data: null,
      });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await getUsers(req.decoded);
      return res.status(200).send({
        success: 1,
        message: "succesfully got users",
        data: users,
      });
    } catch (e) {
      return res.status(500).send({
        success: 1,
        message: "something went wrong while fetching users",
        data: null,
      });
    }
  },
  updateUsers: async (req, res) => {
    try {
      const body = req.body;
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const user = await updateUser(body);
      return res.status(201).send({
        success: 1,
        message: "user updated successfully",
      });
    } catch (e) {
      return res.status(500).send({
        success: 0,
        message: "error in updating user",
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const data = req.body;
      const user = await deleteUser(data);
      if (!user) {
        return res.status(404).send({
          success: 0,
          message: "user not found",
        });
      }
      return res.status(200).send({
        success: 1,
        message: "user deleted successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "something went wrong while deleting user",
      });
    }
  },
  checkToken: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await web.balanceOf(body.address);
      if (!result) {
        return res.status(404).send({
          success: 0,
          message: "user not found",
        });
      }
      console.log(result);
      return res.status(200).send({
        success: 1,
        message: "successfully got balance",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "something went wrong while getting balance",
      });
    }
  },
  sendRequest: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const land = await getLandById(body.land_id);
      const district = await getDistrictById(land.district_id);
      const province = await getProvinceById(district.province_id);
      const getGlobal = await web.getGlobalId();
      const result = {
        email: req.decoded.result.email,
        requestId: getGlobal,
        reason: body.reason,
        land: `${land.land_no} ${land.block} ${land.area}`,
        landId: land.land_id,
        district: `${district.name}`,
        province: `${province.name}`,
        ownership: body.ownership,
      };
      const landObj = {
        land: `${land.land_no} ${land.block} ${land.area}`,
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
      if (!transaction) {
        return res.status(400).send({
          success: 0,
          message: "not enough tokens in your account",
          data: null,
        });
      }
      let dataRequest = {};
      dataRequest.requestID = getGlobal;
      dataRequest.user_id = 3;
      dataRequest.land_id = land.land_id;
      dataRequest.accept_status = 0;
      dataRequest.approve_status = 0;
      await setRequests(dataRequest);
      return res.status(202).send({
        success: 1,
        message: "succesfully sent request",
        data: transaction.transactionHash,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in sending requests",
        data: null,
      });
    }
  },
  checkLand: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const land = await getLandById(body.land_id);
      const district = await getDistrictById(land.district_id);
      const province = await getProvinceById(district.province_id);
      const landObj = {
        land: `${land.land_no} ${land.block} ${land.area}`,
        district: `${district.name}`,
        province: `${province.name}`,
        owner: `${body.owner_key}`,
      };
      const hash = sha256AsHexString(Object.values(landObj).join(""));
      const result = await web.checkRequest(land.request_id);
      if (hash == result[5]) {
        return res.status(200).send({
          success: 0,
          message: "hash is correct",
          data: { hash: hash },
        });
      }
      return res.status(200).send({
        success: 0,
        message: "hash is incorrect",
        data: null,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: 0,
        message: "error in checking land",
        data: null,
      });
    }
  },
  checkRequest: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const requests = await getRequestsByUserId(body.user_id);
      if (!requests.length) {
        return res.status(404).send({
          success: 0,
          message: "no requests made",
          data: null,
        });
      }
      let result = [];
      let requestsArray = [];
      let toShow = [];
      for (let i = 0; i < requests.length; i++) {
        toShow.push({});
        result[i] = await web.checkRequest(requests[i].request_id);
        toShow[i].requestStatus = result[i][1];
        toShow[i].requestApproval = result[i][2];
        // var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
        // var mystr1 = mykey.update(result[i][4], "hex", "utf8");
        // mystr1 += mykey.final("utf8");
        let mystr1 = newDecrypt(result[i][4]);
        requestsArray[i] = mystr1.split(",");
        requestsArray[i].pop();
        toShow[i].email = requestsArray[i][0];
        toShow[i].requestId = requestsArray[i][1];
        toShow[i].reason = requestsArray[i][2];
        toShow[i].land = requestsArray[i][3];
        toShow[i].landId = requestsArray[i][4];
        toShow[i].district = requestsArray[i][5];
        toShow[i].province = requestsArray[i][6];
        toShow[i].transfer = requestsArray[i][7];
      }
      let hashing;
      let landRequestId;
      for (let i = 0; i < requestsArray.length; i++) {
        landRequestId = await getLandById(requestsArray[i][4]);
        hashing = await web.checkRequest(landRequestId.request_id);
        console.log("hashing");
        console.log(hashing);
        if (hashing[5] == result[i][5]) {
          result[i][6] = "correct";
          toShow[i].hash = "correct";
        } else {
          result[i][6] = "incorrect";
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
  sendToken: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await web.sendToken(body.to, body.private_key);
      return res.status(202).send({
        success: 1,
        message: "succesfully got request",
        data: result,
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
  getDistrictByProvince: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await getDistrictByProvince(body.province_id);
      return res.status(202).send({
        success: 1,
        message: "succesfully got provinces",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in getting provinces",
        data: null,
      });
    }
  },
  getLandByDistrictId: async (req, res) => {
    try {
      let body = req.body;
      body.decoded = req.decoded;
      const result = await getLandByDistrictId(body.district_id);
      return res.status(202).send({
        success: 1,
        message: "succesfully got provinces",
        data: result,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        success: 0,
        message: "error in getting provinces",
        data: null,
      });
    }
  },
};
