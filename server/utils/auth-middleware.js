const jwt = require("jsonwebtoken");
const jwtIdentifier = require("express-jwt");

const bcrypt = require("bcrypt");
const User = require("../models").user;
const admin = require("./userData").privilegedUsers[0];

require("dotenv").config();

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "secret", (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

// create json web token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, "secret", {
    expiresIn: Number("111111111111"),
  });
};

const signup = async (req, res) => {
  const { email, password, username } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  try {
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Please fill the all information" });
    }
    let user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      return res
        .status(400)
        .json({ message: "A user with that email already exists" });
    }

    user = await User.create({ email, password: hash, username });

    if (email === admin.email) {
      user.role = admin.role;
    }
    const token = createToken(user.id, user.role);
    // send back the new user and auth token to the client
    return res.status(201).json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.toString() });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill the all information" });
  }
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      try {
        let role;
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          if (email === admin.email) {
            role = admin.role;
          }
          const token = createToken(user.id, role);

          // send back the new user and auth token to the client
          return res.status(200).json({ token, user, role });
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
    return res.status(403).json({ message: "not authorized" });
  }

  let token = req.headers.authorization.split("Bearer ")[1];

  if (!token || token === "null") {
    return res.status(403).json({ message: "not authorized" });
  }
  try {
    const info = await verifyToken(token);
    let role;
    if (info.role === admin.role) {
      role = admin.role;
    }

    const user = await User.findByPk(info.id);
    res.status(200).json({ user, role });

    //   .select('-password') //removing password
    //   .lean() //converting into json data from mongoose
    //   .exec(); // Will execute returning a promise
    // req.user = user; //we removed the password and execution will be continued for routes actions
  } catch (e) {
    return res.status(401).json({ message: e.toString() });
  }
};

const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwtIdentifier({ secret: "secret", algorithms: ["HS256"] }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      next();
    },
  ];
};

module.exports = { signin, signup, protect, authorize };
