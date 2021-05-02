const express = require("express");
const router = express.Router();
const groupController = require("../controllers").group;
const { authorize } = require("../utils/auth-middleware");
router
  .route("/")
  .post(authorize("admin"), groupController.create)
  .get(authorize("admin"), groupController.list);

router.route("/count").get(groupController.getCount);

router
  .route("/:id")
  .get(groupController.getOne)
  .delete(authorize("admin"), groupController.deleteOne)
  .patch(groupController.update);

module.exports = router;
