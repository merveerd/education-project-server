var redis = require("redis");
var client = redis.createClient(6379, "localhost");

const { cacheRemover, cacheSetter } = require("./helper");
client.on("error", function (err) {
  console.log("Something went wrong ", err.toString());
});

const getOne = (model) => async (req, res) => {
  client.get(`${model.name}-${req.params.id}`, function (err, object) {
    if (object) {
      return res.status(200).json({ data: JSON.parse(object) });
    } else {
      return model
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((result) => {
          cacheSetter(`${model.name}-${req.params.id}`, result);

          res.status(200).json({ data: result });
        })
        .catch((err) => {
          res.status(404).json({ message: err.toString() });
        });
    }
  });
};

const deleteOne = (model) => async (req, res) => {
  return model
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((result) => {
      console.log("result", result);
      result
        .destroy()
        .then(() => {
          console.log("DESTROYED");
          cacheRemover(`${model.name}-all`, result);
          status(200).json({ message: "deleted" });
        })
        .catch((err) => {
          res.status(404).json({ message: err.toString() });
        });
    })
    .catch((err) => {
      res.status(404).json({ message: err.toString() });
    });
};

const list = (model) => (req, res) => {
  try {
    client.get(`${model.name}-all`, async function (err, object) {
      if (object && object.length > 0) {
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
        try {
          const doc = await model.findAll();
          console.log("doc");
          res.status(200).json({ data: doc });
          cacheSetter(`${model.name}-all`, doc);
        } catch (err) {
          res.status(404).json({ message: err.toString() });
        }
      }
    });
  } catch (err) {
    (err) => res.status(400).json({ message: err.toString() });
  }
};

const update = (model) => async (req, res) => {
  let keys = Object.keys(req.body),
    updateObject = {};
  keys.forEach((item) => {
    updateObject[item] =
      typeof req.body[item] === "string"
        ? req.body[item].toLowerCase()
        : req.body[item];
  });

  return model
    .findByPk(req.params.id)
    .then((updatingItem) => {
      if (!updatingItem) {
        return res.status(404).json({
          message: "updatingItem is not found",
        });
      }

      return updatingItem
        .update(updateObject)
        .then((updatingItem) => {
          cacheRemover(`${model.name}-all`);
          cacheRemover(`${model.name}-${req.params.id}`);

          return res.status(201).json({ data: updatingItem });
        })
        .catch((error) => res.status(400).json({ message: err.toString() }));
    })
    .catch((error) => res.status(400).json({ message: err.toString() }));
};

module.exports = function crudController(model) {
  return {
    getOne: getOne(model),
    list: list(model),
    update: update(model),
    deleteOne: deleteOne(model),
  };
};
