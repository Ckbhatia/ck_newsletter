const Auth = require("../utils/auth");

const rootUrl = process.env.NODE_ENV == "production" ? "https://cknewsletter.tech" : "http://localhost:3000";

module.exports = social_controller = async (req, res) => {
  try {
    const token = await Auth.generateToken(req.user.id);
    if (!token) {
      res.redirect("/login");
    }
    // res.cookie("userToken", token);
    res.cookie("userToken", token, { domain: 'cknewsletter.tech', secure: true, SameSite: None });
    // res.redirect(`${rootUrl}/?token=${token}`);
    res.redirect("https://cknewsletter.tech");
  }
  catch (err) {
    res.redirect("/login");
  }
};