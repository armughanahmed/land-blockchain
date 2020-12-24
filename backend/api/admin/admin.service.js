const pool = require("../../db/mysql");

module.exports = {
  createAdmin: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into departmentofland(name,email,country,city,password) 
                  values(?,?,?,?,?)`,
        [data.name, data.email, data.country, data.city, data.password],
        (error, results, fields) => {
          if (error) {
            console.log("createAdmin::");
            return reject(error);
          }
          console.log("createAdmin::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  getAdmin: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from departmentofland where email = ?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getAdmin::");
            return reject(error);
          }
          console.log("getAdmin::");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getAdminByEmail: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from departmentofland where email=?`,
        [data],
        (error, results, fields) => {
          if (error) {
            console.log("getAdminByMail::");
            return reject(error);
          }
          console.log("getAdminByMail::");
          console.log(results);
          resolve(results[0]);
        }
      );
    });
  },
  getAdminRequests: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from requests where accept_status=?`,
        [0],
        (error, results, fields) => {
          if (error) {
            console.log("getAdminRequests::");
            return reject(error);
          }
          console.log("getAdminRequests::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  acceptRequest: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update requests set accept_status=?,approve_status=? where request_id=?`,
        [1, 1, data],
        (error, results, fields) => {
          if (error) {
            console.log("acceptRequest::");
            return reject(error);
          }
          console.log("acceptRequest::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  setLandRequestId: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update land set request_id=? where land_id=?`,
        [data.Rid, data.land_id],
        (error, results, fields) => {
          if (error) {
            console.log("setLandRequestId::");
            return reject(error);
          }
          console.log("setLandRequestId::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  rejectRequest: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `update requests set accept_status=?,approve_status=? where request_id=?`,
        [1, 0, data],
        (error, results, fields) => {
          if (error) {
            console.log("rejectRequest::");
            return reject(error);
          }
          console.log("rejectRequest::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  addLand: (data) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into land(district_id,area,block,land_no,request_id) 
        values(?,?,?,?,?)`,
        [
          data.district_id,
          data.area,
          data.block,
          data.land_no,
          data.request_id,
        ],
        (error, results, fields) => {
          if (error) {
            console.log("rejectRequest::");
            return reject(error);
          }
          console.log("rejectRequest::");
          console.log(results);
          resolve(results);
        }
      );
    });
  },
  getDistrict: () => {
    return new Promise((resolve, reject) => {
      pool.query(`select * from district`, (error, results, fields) => {
        if (error) {
          console.log("getDistrict::");
          return reject(error);
        }
        console.log("getDistricts");
        console.log(results);
        resolve(results);
      });
    });
  },
  // createOrganization: (data, callback) => {
  //   pool.query(
  //     `insert into Organizations(name, type,email, password, country, city, zipCode,officeAddress,phoneNumber,NTN)
  //               values(?,?,?,?,?,?,?,?,?,?)`,
  //     [
  //       data.name,
  //       data.type,
  //       data.email,
  //       data.password,
  //       data.country,
  //       data.city,
  //       data.zipCode,
  //       data.officeAddress,
  //       data.phoneNumber,
  //       data.NTN,
  //     ],
  //     (error, results, fields) => {
  //       if (error) {
  //         callback(error);
  //       }
  //       pool.query(
  //         `insert into employees(org_id,name, email, country, city, password,role,active)
  //                   values(?,?,?,?,?,?,?,?)`,
  //         [
  //           results.insertId,
  //           data.name,
  //           data.email,
  //           data.country,
  //           data.city,
  //           data.password,
  //           "admin",
  //           0,
  //         ],
  //         (error, results, fields) => {
  //           if (error) {
  //             callback(error);
  //           }
  //         }
  //       );
  //       return callback(null, results);
  //     }
  //   );
  // },
};
