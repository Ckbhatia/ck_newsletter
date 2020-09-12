const express = require("express")
const router = express.Router();
const passport = require("passport")
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require("../models/user");
const social_controller = require('../controllers/social_controller');

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Static urls are needed to be updated
const rootUrl = process.env.NODE_ENV == "production" ? "https://cknewsletter.herokuapp.com" : "http://localhost:3000";

router.use(passport.initialize());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${rootUrl}/users/auth/github/callback`,
},
  async (accessToken, refreshToken, profile, callBack) => {
    User.findOne({ username: profile.username }).then(user => {
      if (user) {
        callBack(null, user)
      }
      else {
        User.findOne({ email: profile.emails[0].value }).then(user => {
          if (!user) {
            // Create a user if doesn't exists already
            user = new User({
              username: profile.username,
              // lastName: profile.name.familyName,
              name: profile.displayName,
              // profileImage: profile.photos ? profile.photos[0].value : null,
              email: profile.emails ? profile.emails[0].value : null
            })
            user.save();
            callBack(null, user)
          } else {
            callBack(null, user);
          }
        })
      } return user
    })
  }))

passport.use(new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${rootUrl}/users/auth/google/callback`,
  profileFields: ['id', 'displayName', 'name', 'emails']
},
  async (accessToken, refreshToken, profile, callBack) => {
    User.findOne({ username: profile.userName }).then(user => {
      if (user) {
        callBack(null, user)
      }
      else {
        User.findOne({ email: profile.emails[0].value }).then(user => {
          if (!user) {
            // Create a user if doesn't exists already
            user = new User({
              username: profile.displayName,
              // lastName: profile.name.familyName,
              name: profile.name.givenName + " " + profile.name.familyName,
              // profileImage: profile.photos ? profile.photos[0].value : null,
              email: profile.emails ? profile.emails[0].value : null
            })
            user.save();
            callBack(null, user)
          } else {
            callBack(null, user);
          }
        })
      } return user
    })
  }))

router.get('/github', passport.authorize('github', { scope: ['email'] }))
router.get("/github", passport.authenticate("github"))
router.get(
  "/github/callback", passport.authenticate("github", { session: false }), async (req, res) => { social_controller(req, res); }
);

router.get('/google', passport.authorize('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }))

router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback", passport.authenticate("google", { session: false }), async (req, res) => { social_controller(req, res); }
);

module.exports = router;