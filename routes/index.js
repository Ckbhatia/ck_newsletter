const router = require("express").Router();

/* GET static pages. */
router.get("*", function(req, res) {
  res.render("index", { title: "The newsletter app" });
});

module.exports = router;
