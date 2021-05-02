const redis = require("redis");
var Sequelize = require("sequelize");
const client = redis.createClient(6379, "localhost");
const crudControllers = require("../utils/crud");
const users = require("../models").user;

client.on("error", function (err) {
  console.log("Something went wrong with redis", err);
});

module.exports = {
  ...crudControllers(users),

  listByLocation(req, res) {
    return users
      .findAll({
        raw: true,
        where: Sequelize.where(
          Sequelize.fn("unaccent", Sequelize.col("city")),
          {
            [Sequelize.Op.iLike]: `%${req.params.city}%`,
          }
        ),
        order: [["city", "ASC"]],
      })
      .then(function (result) {
        res.status(200).json({ data: result });
      })
      .catch((error) => {
        res.status(400).send(error.toString());
      });
  },
};
