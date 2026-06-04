"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Paper {
  id: string;
  title: string;
}

export default function ComparePage() {
  const [papers, setPapers] = useState<
    Paper[]
  >([]);

  const [paperAId, setPaperAId] =
    useState("");

  const [paperBId, setPaperBId] =
    useState("");

  const [result, setResult] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch(console.error);
  }, []);

  async function handleCompare() {
    if (!paperAId || !paperBId) {
      alert("Please select two papers.");
      return;
    }

    if (paperAId === paperBId) {
      alert(
        "Please select two different papers."
      );
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "/api/compare",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            paperAId,
            paperBId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Comparison failed"
        );
      }

      setResult(
        data.comparison ??
          "No comparison generated."
      );
    } catch (error) {
      console.error(error);

      setResult(
        "Failed to compare papers."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Compare Research Papers
        </h1>

        <p className="mt-2 text-gray-400">
          Compare methodologies,
          findings, strengths, and
          weaknesses using AI.
        </p>
      </div>

      {/* Selection Panel */}
      <div className="mb-8 rounded-xl border p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Paper A
            </label>

            <select
              value={paperAId}
              onChange={(e) =>
                setPaperAId(
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-2"
            >
              <option value="">
                Select Paper A
              </option>

              {papers.map((paper) => (
                <option
                  key={paper.id}
                  value={paper.id}
                >
                  {paper.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Paper B
            </label>

            <select
              value={paperBId}
              onChange={(e) =>
                setPaperBId(
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-2"
            >
              <option value="">
                Select Paper B
              </option>

              {papers.map((paper) => (
                <option
                  key={paper.id}
                  value={paper.id}
                >
                  {paper.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="mt-6 rounded-lg border px-6 py-2 disabled:opacity-50"
        >
          {loading
            ? "Analyzing Papers..."
            : "Compare Papers"}
        </button>

        {loading && (
          <div className="mt-4 rounded-lg border p-3">
            <p className="font-medium">
              AI is working...
            </p>

            <p className="text-sm text-gray-400">
              Comparing methodologies,
              findings, strengths, and
              weaknesses...
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <section className="rounded-xl border p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Comparison Result
          </h2>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
            >
              {result}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </main>
  );
}