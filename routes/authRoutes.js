const authController = require("../controller/authController");
const express = require('express')
const authRouter = express.Router()

authRouter.route('/register')
  .post(authController.register)
  .get(authController.getRegisterPage)

authRouter.route('/login')
  .post(authController.login)
  .get(authController.getLoginPage)

authRouter.route('/logout')
  .get(authController.logout)

module.exports = authRouter;
