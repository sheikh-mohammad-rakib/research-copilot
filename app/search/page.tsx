"use client";

import Link from "next/link";
import { useState } from "react";

interface Paper {
  id: string;
  title: string;
  summary: string | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(
        query
      )}`
    );

    const data = await res.json();

    setPapers(data);
    setLoading(false);
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-4xl font-bold">
        Search Papers
      </h1>

      <div className="mb-8 flex gap-2">
        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search papers..."
          className="flex-1 rounded border p-2"
        />

        <button
          onClick={handleSearch}
          className="rounded border px-4 py-2"
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      <div className="space-y-4">
        {papers.map((paper) => (
          <Link
            key={paper.id}
            href={`/papers/${paper.id}`}
            className="block rounded border p-4"
          >
            <h2 className="font-semibold">
              {paper.title}
            </h2>

            {paper.summary && (
              <p className="mt-2 line-clamp-3 text-sm">
                {paper.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}