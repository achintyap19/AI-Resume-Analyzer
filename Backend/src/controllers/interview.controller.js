const pdfParse = require('pdf-parse')
const generateInterviewReportAI = require('../services/ai.services')
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReport(req,res){

    const uint8Array = new Uint8Array(req.file.buffer)

    const resumeContent = await (new pdfParse.PDFParse(uint8Array)).getText()

    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReportAI({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi

    })
    res.status(201).json({
        message: 'Interview report generated success',
        interviewReport

    })
}

module.exports = {generateInterviewReport}