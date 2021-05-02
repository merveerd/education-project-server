const express = require("express");
const router = express.Router();
const userController = require("../controllers").user;
const { authorize } = require("../utils/auth-middleware");
const { signup } = require("../utils/auth-middleware");
router.route("/count").get(userController.getCount); //needs to be top of the :id parameter otherwise giving not an integer error
router.route("/location/:city").get(userController.listByLocation);
router.route("/").post(signup).get(userController.list);

router
  .route("/:id")
  .get(userController.getOne)
  .delete(userController.deleteOne)
  .patch(userController.update);

module.exports = router;
