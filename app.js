const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const expressStaticGzip = require("express-static-gzip");
const cors = require("cors");

if(process.env.NODE_ENV === "development") {
  require('dotenv').config()
}

const whiteList = [process.env.mainUrl, process.env.netlify, process.env.heroku, process.env.localhost];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const socialLoginRouter = require("./routes/social_login");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to mongoDB database
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    err ? console.log(err) : console.log("DB connected");
  }
);

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

app.use(
  "/dist/bundle",
  expressStaticGzip(path.join(__dirname, "dist/bundle"), {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: function (res, path) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

// Using webpack for our development
if (process.env.NODE_ENV === "development") {
  const webpack = require("webpack");
  const webpackConfig = require("./webpack.config");
  const compiler = webpack(webpackConfig);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    })
  );

  app.use(require("webpack-hot-middleware")(compiler));
} else {
  const webpack = require("webpack");
  const webpackConfig = require("./webpack.config.prod");
  const compiler = webpack(webpackConfig);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    })
  );
}

app.use("/api/v1/projects", cors(), projectsRouter);
app.use("/users/auth", cors(corsOptions), socialLoginRouter);
app.use("/users",cors(corsOptions), usersRouter);
app.use("/projects", cors(corsOptions), projectsRouter);
app.use("/", cors(corsOptions), indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
