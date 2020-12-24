const express = require("express");
const cors = require("cors");

const user_router = require("./api/users/user.router");
const admin_router = require("./api/admin/admin.router");
const app = express();
app.use(cors());
const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/user", user_router);
app.use("/admin", admin_router);
app.listen(port, () => {
  console.log("Server running on port " + port);
});
