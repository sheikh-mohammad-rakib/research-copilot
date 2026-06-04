"use client";

import { useState } from "react";

interface Props {
  paperId: string;
}

const suggestedQuestions = [
  "What is the main objective of this paper?",
  "What dataset was used?",
  "What methodology was used?",
  "What are the key findings?",
  "What are the limitations of this study?",
];

export default function PaperChat({
  paperId,
}: Props) {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function askQuestion(
    customQuestion?: string
  ) {
    const finalQuestion =
      customQuestion || question;

    if (!finalQuestion.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          paperId,
          question: finalQuestion,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer);
      setQuestion(finalQuestion);
    } catch {
      setAnswer(
        "Failed to generate answer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Ask This Paper
      </h2>

      {/* Suggested Questions */}
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((item) => (
          <button
            key={item}
            onClick={() => askQuestion(item)}
            className="rounded-full border px-3 py-1 text-sm hover:bg-zinc-900"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Custom Question */}
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask a question about this paper..."
          className="flex-1 rounded border p-2"
        />

        <button
          onClick={() => askQuestion()}
          disabled={loading}
          className="rounded border px-4 py-2"
        >
          {loading
            ? "Analyzing Paper..."
            : "Ask"}
        </button>
        {loading && (
          <p className="mt-3 text-sm text-gray-500">
            Searching paper content...
          </p>
        )}
      </div>

      {/* Answer */}
      {answer && (
        <div className="mt-4 rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">
            Answer
          </h3>

          <p className="whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}