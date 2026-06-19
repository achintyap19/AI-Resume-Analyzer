# AI Resume Analyzer

AI-powered Resume Analyzer built using the MERN stack and Gemini AI.

## Features

* User Authentication
* Resume Analysis
* Job Description Matching
* AI Generated Match Score
* Technical Interview Questions
* Behavioural Interview Questions
* Skill Gap Analysis
* Personalized Preparation Plan

## Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API
* Zod Schema Validation

## Project Workflow

1. User submits:

   * Resume
   * Self Description
   * Job Description

2. AI analyzes the profile

3. System generates:

   * Match Score
   * Technical Questions
   * Behavioural Questions
   * Skill Gaps
   * Preparation Plan

## Installation

### Backend

```bash
cd Backend
npm install
npm nodemon server.js
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```env
PORT=
MONGO_URI=
JWT_SECRET=
GOOGLE_GENAI_API_KEY=
```

## Status

🚧 MVP Under Development
