const express = require("express");
const perfumeController = require("../controller/perfumeController");
const checkRole = require("../middlewares/checkRole");
const perfumeRouter = express.Router();

perfumeRouter.route("/")
  .get(perfumeController.getPerfumePage)

perfumeRouter.route("/add")
  .get(checkRole(true), perfumeController.getAddPerfumePage)
  .post(checkRole(true), perfumeController.addPerfume)

perfumeRouter.route("/:id")
  .get(perfumeController.getPerfumeDetail)
  .delete(checkRole(true), perfumeController.deletePerfume)

perfumeRouter.route("/:id/comment")
  .post(perfumeController.addComment)
  .get(perfumeController.deleteComment)

perfumeRouter.route("/update/:id")
  .get(checkRole(true), perfumeController.getUpdatePerfumePage)
  .put(checkRole(true), perfumeController.updatePerfume)

module.exports = perfumeRouter;
