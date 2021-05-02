var redis = require("redis");
var client = redis.createClient(6379, "localhost");

const { cacheRemover, cacheSetter } = require("./helper");
client.on("error", function (err) {
  console.log("Something went wrong with redis", err.toString());
});

const getOne = (model) => async (req, res) => {
  client.get(`${model.name}-${req.params.id}`, function (err, object) {
    // can be variable for id endpoint for country etc like  let keys = Object.keys(req.body),  where: {
    //         keys[0]: req.params.keys[0],
    //       },
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
      result
        .destroy()
        .then(() => {
          cacheRemover(`${model.name}-all`, result);
          res.status(200).json({ message: "deleted" });
        })
        .catch((err) => {
          res.status(404).json({ message: err.toString() });
        });
    })
    .catch((err) => {
      res.status(404).json({ message: err.toString() });
    });
};

const list = (model) => async (req, res) => {
  try {
    const doc = await model.findAll();
    cacheSetter(`${model.name}-all`, doc);
    res.status(200).json({ data: doc });
  } catch (err) {
    (err) => res.status(404).json({ message: err.toString() });
  }
};

const getCount = (model) => async (req, res) => {
  try {
    const count = await model.count();
    res.status(200).json({ data: count });
  } catch (err) {
    (err) => res.status(400).json({ message: err.toString() });
  }
};

const update = (model) => async (req, res) => {
  return model
    .findByPk(req.params.id)
    .then((updatingItem) => {
      if (!updatingItem) {
        return res.status(404).json({
          message: "updatingItem is not found",
        });
      }
      return updatingItem
        .update({ language_level: req.body.language_level })
        .then((updateObject) => {
          return res.status(201).json({ data: updateObject });
        })
        .catch((err) => res.status(400).json({ message: err.toString() }));
    })
    .catch((err) => res.status(400).json({ message: err.toString() }));
};

module.exports = function crudController(model) {
  return {
    getOne: getOne(model),
    list: list(model),
    update: update(model),
    deleteOne: deleteOne(model),
    getCount: getCount(model),
  };
};
