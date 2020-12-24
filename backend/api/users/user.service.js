const { compareSync } = require("bcryptjs");
const pool = require("../../db/mysql");
module.exports = {
  createUser: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into user(name,email,country,city,password)
      values(?,?,?,?,?)`,
        [data.name, data.email, data.country, data.city, data.password],
        (error, results, fields) => {
          if (error) {
            console.log("createUser::");
            return reject(error);
          }
          console.log("createUser::");
          console.log(results);
          return resolve(results);
        }
      );
    });
  },
  createInvite: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into invites(emp_id,org_id,receiver_email) 
        values(?,?,?)`,
        [data.decode.result.id, data.decode.result.org_id, data.receiver_email],
        (error, results, fields) => {
          if (error) {
            console.log("createInvite::");
            return reject(error);
          }
          console.log("createInvite::");
          console.log(results);
          return resolve(results);
        }
      );
    });
  },
  create: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into employees(org_id,email,role,active)
                    values(?,?,?,?)`,
        [data.decode.result.org_id, data.email, data.role, 0],
        (error, results, fields) => {
          if (error) {
            console.log("create::");
            return reject(error);
          }
          console.log("create::");
          console.log(results);
          return resolve(results);
        }
      );
    });
  },
  getUserByUserEmail: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from user where email = ?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getUserByUserEmail::");
            return reject(error);
          }
          console.log("getUserByUserEmail::");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getUserByUserId: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from employees where id = ?`,
        [id],
        (error, results, fields) => {
          if (error) {
            console.log("getUserByUserId");
            return reject(error);
          }
          console.log("getUserByUserId");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getUsers: (decode) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from employees where org_id = ?`,
        [decode.result.org_id],
        (error, results, fields) => {
          if (error) {
            console.log("getUsers::");
            return reject(error);
          }
          console.log("getUsers::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  updateUser: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update employees set name=? , email=?, country=?, city=?, password=?, role=? where id = ?`,
        [
          data.name,
          data.email,
          data.country,
          data.city,
          data.password,
          data.role,
          data.id,
        ],
        (error, results, fields) => {
          if (error) {
            console.log("updateUser::");
            return reject(error);
          }
          console.log("updateUser::");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  deleteUser: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `delete from employees where id = ?`,
        [data.id],
        (error, results, fields) => {
          if (error) {
            console.log("deleteUser::");
            return reject(error);
          }
          console.log("deleteUser::");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  deleteToken: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `delete from invites where receiver_email = ? and org_id = ?`,
        [data.receiver_email, data.org_id],
        (error, results, fields) => {
          if (error) {
            console.log("deleteToken::");
            return reject(error);
          }
          console.log("deleteToken::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  verifyToken: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update invites set verified = ? where receiver_email = ? and org_id = ?`,
        [1, data.result.receiver_email, data.result.decode.result.org_id],
        (error, results, fields) => {
          if (error) {
            console.log("verifyToken::services ");
            return reject(error);
          }
          console.log("verifyToken::services ");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  verifyTokenStatus: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from invites where receiver_email = ? and org_id = ? and verified = ?`,
        [data.receiver_email, data.org_id, 1],
        (error, results, fields) => {
          if (error) {
            console.log("verifyTokenStatus::services ");
            return reject(error);
          }
          console.log("verifyTokenStatus::services ");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getLandById: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from land where land_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getLandById::");
            return reject(error);
          }
          console.log("getLandById");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getDistrictById: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from district where district_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getDistrictById::");
            return reject(error);
          }
          console.log("getDistrictById");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getProvinceById: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from province where province_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getProvinceById::");
            return reject(error);
          }
          console.log("getProvinceById");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  setRequests: (dataRequest) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into requests(request_id,user_id,land_id,accept_status,approve_status)
        values(?,?,?,?,?)`,
        [
          dataRequest.requestID,
          dataRequest.user_id,
          dataRequest.land_id,
          dataRequest.accept_status,
          dataRequest.approve_status,
        ],
        (error, results, fields) => {
          if (error) {
            console.log("setRequests::");
            return reject(error);
          }
          console.log("setRequests");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  getRequestsByUserId: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from requests where user_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getRequestsByUserId::");
            return reject(error);
          }
          console.log("getRequestsByUserId");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  getDistrictByProvince: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from district where province_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getDistrictByProvince::");
            return reject(error);
          }
          console.log("getDistrictByProvince");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  getLandByDistrictId: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from land where district_id=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getLandByDistrictId::");
            return reject(error);
          }
          console.log("getLandByDistrictId");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
};
