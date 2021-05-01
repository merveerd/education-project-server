const express = require("express");
const router = express.Router();
const user_courseController = require("../controllers/user_course.controller");

router
  .route("/")
  .post(user_courseController.create)
  .get(user_courseController.listAll)
  .delete(user_courseController.delete);

// router.route("/:userId").get(user_courseController.listByUser);

//subroutes can be done for differentiating userId, topic etc like /type/:type
router.route("/:type").get(user_courseController.listByTopic);

module.exports = router;
