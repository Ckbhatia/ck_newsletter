const router = require("express").Router();
const crudControllers = require("../controllers/crudControllers");
const user = require("../models/user");
const Auth = require("../utils/auth");

/* Listen to post request on users/login route */
router.post("/login", crudControllers(user, "login").getOne);

/* Listen to post request on users/register route */
router.post("/register", crudControllers(user, "createUser").createOne);

router.use(Auth.verifyToken);

/* Listen to get, patch and delete request on /users route */
router
  .route("/")
  .get(crudControllers(user, "getCurrentUser").getOne)
  .patch(crudControllers(user, "updateUser").updateOne)
  .delete(crudControllers(user).removeOne);

module.exports = router;
