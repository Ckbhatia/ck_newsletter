const router = require("express").Router();
const crudControllers = require("../controllers/crudControllers");
const project = require("../models/project");
const Auth = require("../utils/auth");

router
  .route("/subscribe")
  .patch(crudControllers(project, "subscribe").updateOne);
router
  .route("/unsubscribe")
  .patch(crudControllers(project, "unSubscribe").updateOne);
router.route("/slug").patch(crudControllers(project, "updateSlugs").updateOne);

router.use(Auth.verifyToken);

router.route("/").post(crudControllers(project, "createProject").createOne);
router.route("/").get(crudControllers(project, "getProjects").getMany);

// Handle project tasks
router.route("/:id").get(crudControllers(project).getOne);
router.route("/:id").patch(crudControllers(project, "updateProject").updateOne);
router
  .route("/:id")
  .delete(crudControllers(project, "deleteProject").removeOne);
module.exports = router;
