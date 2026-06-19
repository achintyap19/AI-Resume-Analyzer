const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access Public
 */
router.post('/register', authController.registerUser)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
router.post('/login', authController.loginUser)

/**
 * @route GET /api/auth/logout
 * @description clear token from the user cookie and add the token in blacklist
 * @access Public
 */
router.get('/logout', authController.logoutUser)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged-in user details
 * @access Private
 */
router.get('/get-me', authMiddleware.authUser, authController.getMe)

module.exports = router