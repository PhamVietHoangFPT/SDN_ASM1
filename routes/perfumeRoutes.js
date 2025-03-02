const express = require("express");
const perfumeController = require("../controller/perfumeController");

const perfumeRouter = express.Router();

perfumeRouter.route("/")
  .get(perfumeController.getPerfumePage);

perfumeRouter.route("/add")
  .get(perfumeController.getAddPerfumePage)
  .post(perfumeController.addPerfume);
module.exports = perfumeRouter;
