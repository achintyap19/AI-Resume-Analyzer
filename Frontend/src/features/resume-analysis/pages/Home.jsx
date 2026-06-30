import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Upload,FileText,Sparkles,Brain,Target,} from "lucide-react";
import {useReport} from '../hooks/useReport'


const Home = () => {

  const navigate = useNavigate()

  const {generateReport, loading} = useReport()

  const resumeInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async(e) => { //FUNCTION FOR API CALL
    e.preventDefault();

    const resumeFile = resumeInputRef.current.files[0]

    if (!resumeFile) {
        alert("Please upload your resume.");
        return;
    }
    if (!selfDescription.trim()) {
        alert("Please enter your self description.");
        return;
    }
    if (!jobDescription.trim()) {
        alert("Please enter the job description.");
        return;
    }

    try{  //API CALL
      const report = await generateReport({
        resumeFile,
        selfDescription,
        jobDescription
      })
      setResume(null)

      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
      setSelfDescription('')
      setJobDescription('')

      navigate(`/reports/${report._id}`)
      }catch(error){
        console.log(error)
        alert(
          error.response?.data?.message ||
          "Something went wrong while generating the report."
        );
    }

    
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 mb-6">
            <Sparkles size={16} />
            <span className="text-sm text-zinc-300">
              AI Powered Interview Preparation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            AI Resume Analyzer
          </h1>

          <p className="mt-5 text-zinc-400 text-lg max-w-3xl">
            Upload your resume, tell us about yourself, and paste a job
            description to receive personalized interview questions,
            skill-gap analysis, and a preparation roadmap.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <Brain className="mb-4" />
            <h3 className="font-semibold text-lg">Interview Questions</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Generate tailored technical and behavioral questions.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <Target className="mb-4" />
            <h3 className="font-semibold text-lg">Skill Gap Analysis</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Discover missing skills and improvement areas.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <FileText className="mb-4" />
            <h3 className="font-semibold text-lg">Preparation Plan</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Get a personalized roadmap to crack interviews.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Resume Upload */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <label className="block text-lg font-semibold mb-4">
              Resume PDF
            </label>

            <label className="border-2 border-dashed border-zinc-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition">
              <Upload size={40} className="mb-4 text-zinc-400" />

              <p className="font-medium">
                {resume ? resume.name : "Drag & Drop Resume PDF"}
              </p>

              <p className="text-sm text-zinc-500 mt-2">
                Click to browse your files
              </p>

              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) =>
                  setResume(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* Self Description */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <label className="block text-lg font-semibold mb-4">
              Tell Us About Yourself
            </label>

            <textarea
              rows="6"
              value={selfDescription}
              onChange={(e) =>
                setSelfDescription(e.target.value)
              }
              placeholder="Describe your background, skills, projects, goals, and interests..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-zinc-600 resize-none"
            />
          </div>

          {/* Job Description */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <label className="block text-lg font-semibold mb-4">
              Job Description
            </label>

            <textarea
              rows="8"
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Paste the job description here..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-zinc-600 resize-none"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="
                bg-white
                text-black
                px-8
                py-4
                rounded-2xl
                font-semibold
                transition-all
                duration-300
                shadow-lg
                hover:scale-105
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  <span>Generating Report...</span>
                </div>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;