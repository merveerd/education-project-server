const express = require("express");
const router = express.Router();
const userController = require("../controllers").user;
const { authorize } = require("../utils/auth-middleware");
router
  .route("/")
  .post(userController.create)
  .get(userController.list);

router
  .route("/:id")
  .get(userController.getOne)
  .delete(userController.deleteOne)
  .patch(userController.update);

module.exports = router;
