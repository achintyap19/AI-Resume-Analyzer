const { GoogleGenAI, Type } = require('@google/genai')
const { z } = require('zod')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Keep your Zod schema exactly as it is for local parsing validation
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behaviouralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(['low', 'medium', 'high'])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    strengths: z.array(z.string()),

    weaknesses: z.array(z.string()),
    title: z.string()
})

// Define a clean, native Gemini Type declaration. 
// This removes `zod-to-json-schema` completely and enforces flawless schema matching.
const geminiResponseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { 
            type: Type.INTEGER, 
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job requirements" 
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "2 Technical questions that can be asked in the interview along with their intention and answer",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question" },
                    intention: { type: Type.STRING, description: "The intention behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behaviouralQuestions: {
            type: Type.ARRAY,
            description: "1 Behavioural question that can be asked in the interview along with their intention and answer",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioural question" },
                    intention: { type: Type.STRING, description: "The intention behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of exactly 2 skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A 3-day preparation plan for the candidate to follow",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day" },
                    tasks: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "List of tasks to be done on this day" 
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        strengths: {
            type: Type.ARRAY,
            description: "List of key strengths of the candidate relevant to the job",
            items: {
                type: Type.STRING
            }
        },

        weaknesses: {
            type: Type.ARRAY,
            description: "List of weaknesses or improvement areas of the candidate",
            items: {
                type: Type.STRING
            }
        },
        title: {
            type: Type.STRING,
            description: "The job title or role being analyzed, for example 'Software Engineer Intern', 'Backend Developer', or 'Machine Learning Engineer', The title field should contain the job role being analyzed."
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behaviouralQuestions", "skillGaps", "preparationPlan","strengths","weaknesses"]
}

async function generateInterviewReportAI({ resume, selfDescription, jobDescription }) {

    const prompt = `
        Generate an interview report for a candidate applying for a Software Engineer role based on the inputs provided below.

        Candidate Resume:
        ${resume || "Not provided"}

        Candidate Self Description:
        ${selfDescription || "Not provided"}

        Target Job Description:
        ${jobDescription || "Not provided"}

        Ensure the JSON matching the schema contains:
        - matchScore
        - 2 technical questions
        - 1 behavioural question
        - 2 skill gaps
        - 3 day preparation plan
        - 3-5 strengths
        - 3-5 weaknesses
        - title (professional job role inferred from the job description)
        Strengths should highlight skills, experiences, and qualities that align well with the role.

        Weaknesses should identify realistic areas for improvement based on the candidate profile and job requirements.
        `

   
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: geminiResponseSchema // Uses SDK's native structure tracking
            }
        })

        
        const rawText = response.text.trim()
        const parsedJson = JSON.parse(rawText)

       
        const report = interviewReportSchema.parse(parsedJson)   

        console.log("Success! Validated Interview Report Object:", JSON.stringify(report, null, 2))
        return report

    
}

module.exports = generateInterviewReportAI