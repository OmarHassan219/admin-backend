const express = require('express')
const router = express.Router()
const authController = require('../controllers/authControllers')
const refreshController = require('../controllers/refreshTokenController')
const logoutController = require('../controllers/logoutController')




router.post('/', authController.handleNewUser)
router.post('/sign-in', authController.handleLogin)
router.post('/refresh', refreshController.handleRefreshToken)
router.post('/logout', logoutController.handleLogout)


module.exports = router