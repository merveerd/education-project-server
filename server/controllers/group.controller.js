var redis = require("redis");
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
var client = redis.createClient(6379, redisHost);

const crudControllers = require("../utils/crud");
const groups = require("../models").group;
const { cacheRemover } = require("../utils/helper");
client.on("error", function (err) {
  console.log("Something went wrong with redis", err);
});

module.exports = {
  ...crudControllers(groups),
  create(req, res) {
    return groups
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },

        defaults: {
          name: req.body.name.toLowerCase(),
          school: req.body.school.toLowerCase(),
          grade: req.body.grade.toLowerCase(),
          country: req.body.country.toLowerCase(),
          city: req.body.city.toLowerCase(),
        },
      })
      .then((result) => {
        cacheRemover(`group-all`); //removing previous record since there is new one added
        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(` error: ${error.toString()}`));
  },
};
