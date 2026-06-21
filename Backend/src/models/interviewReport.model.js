const mongoose = require('mongoose')

/**
 * -job description schema
 * -resume text
 * -self description
 * 
 * -matchScore: Number
 * 
 * -Technical ques nd ans : [{question:"", intention:"", answer:""}]
 * -Behavioural ques : [{question:"", intention:"", answer:""}]
 * -Skills gaps : [{skill:"", severity: enum:[low,med,high]}]
 * -preparation plan : [{day: Number, focus: String, tasks:[String]}]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, 'Technical question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
}, {id: false})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, 'Behavioural question is required']
    },
    intention:{
        type: String,
        required: [true, 'Intention is required']
    },
    answer:{
        type: String,
        required: [true, 'Answer is required']
    }
}, {id: false})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required:[true, "Skill is required"]
    },
    severity:{
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required']
    }

},{_id: false})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, 'Day is required']
    },
    focus:{
        type: String,
        required: [true, 'Focus is required']
    },
    tasks:{
        type: [String],
        required: [true, 'Tasks is required']
    }
},{ _id: false })

const interviewReportSchema = new mongoose.Schema({

    jobDescription:{
        type: String,
        required: [true, 'Job description is required']
    },
    resume:{
        type: String
    },
    selfDescription:{
        type: String
    },
    matchScore:{
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    strengths: [{
        type: String
    }],
    weaknesses: [{
        type: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    
},{timestamps: true})

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema )

module.exports = interviewReportModel