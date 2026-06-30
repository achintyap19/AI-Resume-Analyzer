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

/**
 * @route GET /api/interview/reports/:reportId
 * @description get interview report by report id
 * @access private
 */
router.get('/reports/:reportId', authMiddleware.authUser, interviewController.getInterviewReportById )

/**
 * @route GET /api/interview/
 * @description get all interview reports by users
 * @access private
 */
router.get('/', authMiddleware.authUser, interviewController.getAllInterviewReports )

module.exports = router

