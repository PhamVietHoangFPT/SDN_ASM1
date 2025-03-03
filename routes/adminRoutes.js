const express = require("express")
const adminController = require("../controller/adminController")
const adminRouter = express.Router()
const checkRole = require("../middlewares/checkRole")

adminRouter.route("/")
  .get(checkRole(true), adminController.getAllMembers)

module.exports = adminRouter