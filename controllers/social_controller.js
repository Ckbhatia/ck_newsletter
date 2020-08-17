const Auth = require("../utils/auth");

const rootUrl = process.env.NODE_ENV == "production" ? "https://cknewsletter.herokuapp.com" : "http://localhost:3000";

module.exports = social_controller = async (req, res) => {
  try {
    const token = await Auth.generateToken(req.user.id);
    if (!token) {
      res.redirect("/login");
    }
    res.redirect(`${rootUrl}/?token=${token}`);
  }
  catch (err) {
    res.redirect("/login");
  }
};