const pool = require("../db/mysql");
const createDstrict = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `insert into district(district_id,province_id,code,name)
      values(?,?,?,?)`,
      [data.district_id, data.province_id, data.code, data.name],
      (error, results, fields) => {
        if (error) {
          console.log("createDstrict::");
          return reject(error);
        }
        console.log("createDstrict::");
        console.log(results);
        return resolve(results);
      }
    );
  });
};

const create = async () => {
  const obj = [
    {
      district_id: 1,
      province_id: 1,
      code: 7319,
      name: "east",
    },
    {
      district_id: 2,
      province_id: 2,
      code: 7320,
      name: "south",
    },
    {
      district_id: 3,
      province_id: 3,
      code: 7384,
      name: "west",
    },
    {
      district_id: 4,
      province_id: 4,
      code: 7355,
      name: "maymar-east",
    },
    {
      district_id: 5,
      province_id: 1,
      code: 7374,
      name: "east",
    },
    {
      district_id: 6,
      province_id: 1,
      code: 7312,
      name: "east",
    },
    {
      district_id: 7,
      province_id: 2,
      code: 7343,
      name: "east",
    },
    {
      district_id: 8,
      province_id: 1,
      code: 7359,
      name: "east",
    },
  ];
  for (let i = 0; i < obj.length; i++) {
    await createDstrict(obj[i]);
  }
};
create();
