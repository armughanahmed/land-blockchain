const crypto = require("crypto");

function sha256AsHexString(doc) {
  return (
    "0x" +
    crypto
      .createHash("sha256")
      .update(doc, "utf8")
      .digest("hex")
  );
}

const obj = {
  reason: "weed",
  land: "b-263",
};

function check() {
  //   const a = Object.values(obj);
  //   const b = a.join("");
  console.log(sha256AsHexString(Object.values(obj).join("")));
}
check();
