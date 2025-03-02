const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controller/brandController");

brandRouter.route("/")
  .get(brandController.getBrandPage)

brandRouter.route("/add")
  .get(brandController.getAddBrandPage)
  .post(brandController.addBrand)

module.exports = brandRouter;
