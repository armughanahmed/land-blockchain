var crypto = require("crypto");
const obj = {
  reason: "weed",
  land: 1,
};
const a = Object.values(obj);
for (let i = 0; i < a.length; i++) {
  a[i] = a[i] + ",";
  console.log(a[i]);
}
const b = a.join("");
console.log(b);
var mykey = crypto.createCipher("aes-128-cbc", "mypassword");
var mystr = mykey.update(b, "utf8", "hex");
mystr += mykey.final("hex");

console.log(mystr); //34feb914c099df25794bf9ccb85bea72

var mykey = crypto.createDecipher("aes-128-cbc", "mypassword");
var mystr1 = mykey.update(mystr, "hex", "utf8");
mystr1 += mykey.final("utf8");

console.log(mystr1.split(",")); //abc
