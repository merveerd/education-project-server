const express = require("express");
const router = express.Router();
const user_courseController = require("../controllers/user_course.controller");

router
  .route("/")
  .post(user_courseController.create)
  .get(user_courseController.listAll)
  .delete(user_courseController.delete);

router.route("/count").get(user_courseController.getCount);
router.route("/user/:userId").get(user_courseController.listByUser);

// router.route("/user/:userId/type/:type").get(user_courseController.listByType);

module.exports = router;
