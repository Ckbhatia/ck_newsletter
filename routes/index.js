const router = require("express").Router();

/* GET static pages. */
router.get("*", function (req, res) {
  const cssPath =
    process.env.NODE_ENV == "production"
      ? `/dist/bundle/bundle.css`
      : "/static/bundle.css";
  const jsPath =
    process.env.NODE_ENV == "production"
      ? `/dist/bundle/bundle.js`
      : "/static/bundle.js";
  res.render("index", {
    title: "Ck newsletter | Connected",
    jsPath,
    cssPath,
  });
});

module.exports = router;
