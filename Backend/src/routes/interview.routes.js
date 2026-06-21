const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')


const router = express.Router()


/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user's resume pdf, self description and job description
 * @access private
 */
router.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReport)

module.exports = router

