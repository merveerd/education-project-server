var redis = require("redis");
var client = redis.createClient(6379, "localhost");

const courses = require("../models").course;
const crudControllers = require("../utils/crud");
const { cacheRemover } = require("../utils/helper");

client.on("error", function (err) {
  console.log("Something went wrong with redis", err);
});

module.exports = {
  ...crudControllers(courses),
  create(req, res) {
    return courses
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },
        defaults: {
          name: req.body.name.toLowerCase(),
          topic: req.body.topic.toLowerCase(),
          type: req.body.type.toLowerCase(),
          content: req.body.content.toLowerCase(),
          level: req.body.level.toLowerCase(),
        },
      })
      .then((result) => {
        cacheRemover(`course-all`);

        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(error));
  },
};
