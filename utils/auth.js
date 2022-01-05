const jwt = require("jsonwebtoken");
const User = require("../models/user");

if(process.env.NODE_ENV === "development") {
  require('dotenv').config()
}

/**
 * Generates JWT token
 * @param {string}
 * @return {string}
 */
exports.generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME
  });
};

/**
 * Verifies the token
 * @param {object}
 * @param {object}
 * @param {function}
 * @return {object}
 */
exports.verifyToken = (req, res, next) => {
  //Note: First character is lower case for some error reasons, authorization.
  let token = req.headers.authorization || "";
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, userToken) => {
      try {
        const user = await User.findById(userToken.userId)
          .select("-password")
          .exec();

        if (!user) {
          return res.json({ msg: "User not found.", status: "failed" });
        }
        // Set user in req. object
        req.user = user;
        next();
      } catch (err) {
        res.status(401).json({ msg: "Invalid token.", status: "failed" });
      }
    });
  } else {
    res.status(401).json({ msg: "Unauthorized access", status: "failed" });
  }
};
