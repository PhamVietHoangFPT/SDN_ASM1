const express = require('express')
const memberRouter = express.Router()
const memberController = require('../controller/memberController')

memberRouter.route('/profile')
  .get(memberController.getProfilePage)

memberRouter.route('/editProfile')
  .get(memberController.getEditProfilePage)
  .post(memberController.editProfile)

memberRouter.route('/changePassword')
  .get(memberController.getEditPasswordPage)
  .post(memberController.editPassword)
module.exports = memberRouter