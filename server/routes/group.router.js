const express = require("express");
const router = express.Router();
const groupController = require("../controllers").group;

router.route("/").post(groupController.create).get(groupController.list);

router
  .route("/:id")
  .get(groupController.getOne)
  .delete(groupController.deleteOne)
  .patch(groupController.update);

module.exports = router;
