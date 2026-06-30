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

async function getInterviewReportById(req, res){

    const {reportId} = req.params
    const interviewReport = await interviewReportModel.findOne({
        _id: reportId, user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        });
    }

    res.status(200).json({
        message: 'interview report fetched successfully',
        interviewReport
    })
}

async function getAllInterviewReports(req, res){

    const interviewReports = await interviewReportModel.find({user: req.user.id})
    .sort({createdAt: -1}).select("title matchScore createdAt")
    res.status(200).json({
        message: "Reports fetched successfully",
        interviewReports
    });
}
module.exports = {generateInterviewReport, getInterviewReportById, getAllInterviewReports}