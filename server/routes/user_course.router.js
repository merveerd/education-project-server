const express = require("express");
const router = express.Router();
const user_courseController = require("../controllers/user_course.controller");

router
  .route("/")
  .post(user_courseController.create)
  .get(user_courseController.listAll)
  .delete(user_courseController.delete);

router.route("/:user").get(user_courseController.listByUser);

router
  .route("/:type/:user")
  .get(user_courseController.listByTopicTypeUserwithCache);

module.exports = router;
