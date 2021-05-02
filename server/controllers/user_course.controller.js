const users = require("../models").user;
const courses = require("../models").course;
const user_course = require("../models").user_course;
const crudControllers = require("../utils/crud");

var redis = require("redis");
var client = redis.createClient(6379, "localhost");

client.on("error", function (err) {
  console.log("Something went wrong with redis", err);
});

const { cacheRemover, cacheSetter } = require("../utils/helper");

module.exports = {
  ...crudControllers(users),
  create(req, res) {
    return user_course
      .findOrCreate({
        where: {
          user_id: req.body.user_id,
          course_id: req.body.course_id,
        },
        defaults: {
          user_id: req.body.user_id,
          course_id: req.body.course_id,
          score: req.body.score,
          completion: req.body.completion,
          finish_time: req.body.finish_time,
        },
      })
      .then((result) => {
        cacheRemover("all-courses");
        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((err) => {
        res.status(400).json({ message: err.toString() });
      });
  },

  delete(req, res) {
    return user_course
      .findOne({
        where: {
          user_id: req.body.user_id,
          course_id: req.body.course_id,
        },
      })
      .then((result) => {
        result.destroy();

        cacheRemover("all-courses");
        return status(200).json({ message: "deleted" });
      })
      .catch((err) => {
        res.status(404).json({ message: err.toString() });
      });
  },

  listByType(req, res) {
    client.get(`all-user-courses-${req.params.type}`, function (err, object) {
      if (object) {
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
        return user_course
          .findAll({
            raw: true,
            attributes: [["course_id", "course id"]],
            include: [
              {
                model: users,
                as: "users",
                attributes: [["name", "name"]],
              },
              {
                model: courses,
                where: {
                  type: req.params.type,
                },
                as: "courses",
                attributes: [
                  ["name", "name"],
                  ["topic", "topic"],
                  ["type", "type"],
                ],
              },
            ],
          })
          .then(function (result) {
            cacheSetter(
              `all-courses-${req.params.user}-${req.params.type}-${req.body.minCap}-${req.body.maxCap}`,
              result
            );

            res.status(200).json({ data: result });
          })
          .catch((err) => {
            res.status(400).json({ message: err.toString() });
          });
      }
    });
  },

  listAll(req, res) {
    client.get(`all-courses`, function (err, object) {
      if (object) {
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
        return user_course
          .findAll({
            raw: true,
            attributes: [["course_id", "course id"]],
            include: [
              {
                model: users,
                as: "users",
                attributes: [["name", "name"]],
              },
              {
                model: courses,
                as: "courses",
                attributes: [
                  ["topic", "topic"],
                  ["level", "level"],
                  ["content", "content"],
                  ["type", "type"],
                ],
              },
            ],
          })
          .then(function (result) {
            //cacheSetter(`all-courses`);

            res.status(200).json({ data: result });
          })
          .catch((err) => {
            res.status(400).json({ message: err.toString() });
          });
      }
    });
  },

  listByUser(req, res) {
    client.get(`${req.params.userId}-all-courses`, function (err, object) {
      if (object) {
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
        return user_course
          .findAll({
            raw: true,
            attributes: [["course_id", "course id"]],
            include: [
              {
                model: users,
                where: {
                  id: req.params.userId.toLowerCase(),
                },
                as: "users",
                attributes: [["email", "email"]],
              },
              {
                model: courses,
                as: "courses",
                attributes: [
                  ["name", "name"],
                  ["type", "type"],
                  ["topic", "topic"],
                  ["level", "level"],
                  ["content", "content"],
                ],
              },
            ],
          })
          .then(function (result) {
            cacheSetter(`${req.params.userId}-all-courses`, result);

            return res.status(200).json({ data: result });
          })
          .catch((err) => {
            res.status(400).json({ message: err.toString() });
          });
      }
    });
  },
};
