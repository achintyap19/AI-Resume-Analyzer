import { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Brain,
  Target,
} from "lucide-react";

const Home = () => {
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setResume('')
    setSelfDescription('')
    setJobDescription('')


    console.log({
      resume,
      selfDescription,
      jobDescription,
    });

    // API Call Here
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
              className="
                bg-white
                text-black
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:scale-105
                transition-all
                duration-300
                shadow-lg
              "
            >
              Analyze Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;