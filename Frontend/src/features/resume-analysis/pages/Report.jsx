import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReport } from "../hooks/useReport";

function Report() {
  const { reportId } = useParams();

  const {
    report,
    loading,
    getReportById,
  } = useReport();

  useEffect(() => {
    getReportById(reportId);
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Report Not Found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <section className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold">
            {report.title}
          </h1>

          <p className="text-gray-500 mt-2">
            AI Generated Interview Report
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3">
              Match Score
            </h2>

            <h1 className="text-6xl font-bold text-blue-600">
              {report.matchScore}%
            </h1>
          </div>
        </section>

        {/* Strengths & Weaknesses */}

        <section className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Strengths
            </h2>

            <ul className="space-y-3">
              {report.strengths.map((strength, index) => (
                <li key={index}>
                  ✅ {strength}
                </li>
              ))}
            </ul>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Weaknesses
            </h2>

            <ul className="space-y-3">
              {report.weaknesses.map((weakness, index) => (
                <li key={index}>
                  ⚠️ {weakness}
                </li>
              ))}
            </ul>

          </div>

        </section>

        {/* Technical Questions */}

        <section className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Technical Questions
          </h2>

          <div className="space-y-6">

            {report.technicalQuestions.map((question, index) => (

              <div
                key={index}
                className="border rounded-lg p-5"
              >

                <h3 className="font-bold text-lg">
                  Q{index + 1}. {question.question}
                </h3>

                <p className="mt-3">
                  <span className="font-semibold">
                    Intention:
                  </span>{" "}
                  {question.intention}
                </p>

                <p className="mt-3">
                  <span className="font-semibold">
                    Suggested Answer:
                  </span>{" "}
                  {question.answer}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* Behavioural Questions */}

        <section className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Behavioural Questions
          </h2>

          <div className="space-y-6">

            {report.behaviouralQuestions.map((question, index) => (

              <div
                key={index}
                className="border rounded-lg p-5"
              >

                <h3 className="font-bold text-lg">
                  Q{index + 1}. {question.question}
                </h3>

                <p className="mt-3">
                  <span className="font-semibold">
                    Intention:
                  </span>{" "}
                  {question.intention}
                </p>

                <p className="mt-3">
                  <span className="font-semibold">
                    Suggested Answer:
                  </span>{" "}
                  {question.answer}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* Skill Gaps */}

        <section className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Skill Gaps
          </h2>

          <div className="space-y-4">

            {report.skillGaps.map((skill, index) => (

              <div
                key={index}
                className="flex justify-between border rounded-lg p-4"
              >

                <p>{skill.skill}</p>

                <span
                  className={`font-semibold ${
                    skill.severity === "high"
                      ? "text-red-500"
                      : skill.severity === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {skill.severity}
                </span>

              </div>

            ))}

          </div>

        </section>

        {/* Preparation Plan */}

        <section className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Preparation Plan
          </h2>

          <div className="space-y-6">

            {report.preparationPlan.map((day) => (

              <div
                key={day.day}
                className="border rounded-lg p-5"
              >

                <h3 className="text-xl font-bold">
                  Day {day.day}
                </h3>

                <p className="mt-2">
                  <span className="font-semibold">
                    Focus:
                  </span>{" "}
                  {day.focus}
                </p>

                <div className="mt-4">

                  <h4 className="font-semibold">
                    Tasks
                  </h4>

                  <ul className="list-disc ml-6 mt-2 space-y-2">

                    {day.tasks.map((task, index) => (
                      <li key={index}>
                        {task}
                      </li>
                    ))}

                  </ul>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default Report;