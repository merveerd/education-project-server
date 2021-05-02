var redis = require("redis");
var client = redis.createClient(6379, "localhost");

const crudControllers = require("../utils/crud");
const users = require("../models").user;
const { cacheRemover } = require("../utils/helper");

client.on("error", function (err) {
  console.log("Something went wrong ", err);
});

module.exports = {
  ...crudControllers(users),
  create(req, res) {
    console.log("create user");
    return users
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },

        defaults: {
          name: req.body.name.toLowerCase(),
          username: req.body.username.toLowerCase(),
          password: req.body.password.toLowerCase(),
          email: req.body.email.toLowerCase(),
          language: req.body.language.toLowerCase(),
          country: req.body.country.toLowerCase(),
          city: req.body.city.toLowerCase(),
          school: req.body.school.toLowerCase(),
          education_level: req.body.education_level.toLowerCase(),
          language_level: req.body.language_level.toLowerCase(),
          score: req.body.score,
          age: req.body.age,
          words: req.body.words,
          grammar: req.body.grammar,
          groupId: req.body.groupId,
        },
      })
      .then((result) => {
        cacheRemover(`user-all`);

        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(` error: ${error.toString()}`));
  },

  listByLocation(req, res) {
    return users
      .findAll({
        raw: true,
        where: {
          country: req.params.country.toLowerCase(),
          city: req.params.state.toLowerCase(), //State city paradigma should be resolved
        },
      })
      .then(function (result) {
        res.status(200).json({ data: result });
      })
      .catch((error) => {
        console.log(error.toString());
        res.status(400).send(error.toString());
      });
  },
};
