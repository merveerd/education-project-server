const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "secret", (err, payload) => {
      if (err) return reject(err);
      resolve(payload.id);
    });
  });
};

// create json web token

const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: Number("111111111111"),
  });
};

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Please fill the all information" });
    }
    let user = await User.find({ email });
    if (user.length > 0) {
      return res
        .status(400)
        .json({ message: "A user with that email already exists." });
    }

    user = await User.create({ email, password, username });
    const token = createToken(user._id);

    return res.status(201).json({ token, user });
  } catch (err) {
    res.status(401).json({ message: "Couldn't signup" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill the all information" });
  }
  try {
    const user = await User.findOne({ email });

    if (user) {
      try {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          const token = createToken(user._id);
          return res.status(200).json({ token, user }); //give the user back too
        } else {
          return res.status(401).json({ message: "incorrect password" });
        }
      } catch (err) {
        return res.status(400).json({ message: "Couldn't signin" });
      }
    } else {
      return res
        .status(401)
        .json({ message: `${email} doesn't match any account.` });
    }
  } catch (err) {
    return res.status(400).json({ message: "Couldn't signin" });
  }
};

const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "not authorized" });
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token || token === "null") {
    return res.status(401).json({ message: "not authorized" });
  }
  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload);
    //   .select('-password') //removing password
    //   .lean() //converting into json data from mongoose
    //   .exec(); // Will execute returning a promise
    // req.user = user; //we removed the password and execution will be continued for routes actions
    res.status(200).json({ user });
  } catch (e) {
    return res.status(401).json({ message: "not authorized" });
  }
};

module.exports = { signin, signup, protect };
