const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controller/brandController");
const checkRole = require("../middlewares/checkRole");
brandRouter.route("/")
  .get(brandController.getBrandPage)

brandRouter.route("/add")
  .get(checkRole(true), brandController.getAddBrandPage)
  .post(checkRole(true), brandController.addBrand)

brandRouter.route("/:brandId")
  .delete(checkRole(true), brandController.deleteBrand)

brandRouter.route("/update/:brandId")
  .get(checkRole(true), brandController.getUpdateBrandPage)
  .put(checkRole(true), brandController.updateBrand)
  
module.exports = brandRouter;
