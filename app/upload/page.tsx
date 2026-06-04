"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(
    null
  );

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState("");

  async function handleUpload() {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Uploading PDF...");

      const formData = new FormData();

      formData.append("file", file);

      setStatus("Extracting text...");

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setStatus(
        "Generating AI summary..."
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      setStatus("Saving to database...");

      const paperId = data.paper?.id || data.paperId;
      if (paperId) {
        window.location.href = `/papers/${paperId}`;
        return;
      }
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while uploading."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Upload Research Paper
        </h1>

        <p className="mt-2 text-gray-400">
          Upload a PDF and let AI
          summarize, analyze and answer
          questions about it.
        </p>
      </div>

      <div className="rounded-xl border p-8">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ?? null
            )
          }
          className="mb-4"
        />

        {file && (
          <div className="mb-4 rounded-lg border p-3">
            <p className="font-medium">
              Selected File
            </p>

            <p className="text-sm text-gray-400">
              {file.name}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="rounded-lg border px-6 py-2 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : "Upload Paper"}
        </button>

        {loading && (
          <div className="mt-4 rounded-lg border p-3">
            <p className="font-medium">
              Please wait...
            </p>

            <p className="text-sm text-gray-400">
              {status}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}