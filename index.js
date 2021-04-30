const express = require("express");
const logger = require("morgan");

const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));
app.use(cors());
app.use(logger("dev"));
const { signup, signin, protect } = require("./server/utils/auth-middleware");
const port = 4000;

//Auth Routes
app.post("/signup", signup);
app.post("/signin", signin);
//app.get("/", protect);

const user_courseRoute = require("./server/routes/user_course.router");
app.use("/usercourse", user_courseRoute);

const userRoute = require("./server/routes/user.router");
app.use("/user", userRoute);

const groupRoute = require("./server/routes/group.router");
app.use("/group", groupRoute);

const courseRoute = require("./server/routes/course.router");
app.use("/course", courseRoute);

app.get("*", (req, res) =>
  res.status(200).json({
    message: "There is no root provided.",
  })
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
