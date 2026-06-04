import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const totalPapers = await prisma.paper.count();

  const totalSummaries =
    await prisma.paper.count({
      where: {
        summary: {
          not: null,
        },
      },
    });

  const totalComparisons =
    await prisma.comparison.count();

  const recentPapers =
    await prisma.paper.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  const recentComparisons =
    await prisma.comparison.findMany({
      include: {
        paperA: true,
        paperB: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  return (
    <main className="container mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Research Copilot
        </h1>

        <p className="mt-3 text-lg text-gray-400">
          AI-powered research paper analysis,
          summarization, comparison and Q&A.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">
            Total Papers
          </h2>

          <p className="mt-2 text-4xl font-bold">
            {totalPapers}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">
            Total Summaries
          </h2>

          <p className="mt-2 text-4xl font-bold">
            {totalSummaries}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">
            Total Comparisons
          </h2>

          <p className="mt-2 text-4xl font-bold">
            {totalComparisons}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10 flex flex-wrap gap-4">
        <Link
          href="/upload"
          className="rounded-lg border px-4 py-2"
        >
          Upload Paper
        </Link>

        <Link
          href="/papers"
          className="rounded-lg border px-4 py-2"
        >
          View Papers
        </Link>

        <Link
          href="/compare"
          className="rounded-lg border px-4 py-2"
        >
          Compare Papers
        </Link>

        <Link
          href="/comparisons"
          className="rounded-lg border px-4 py-2"
        >
          Comparison History
        </Link>

        <Link
          href="/search"
          className="rounded-lg border px-4 py-2"
        >
          Search Papers
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Papers */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Recent Papers
          </h2>

          <div className="space-y-3">
            {recentPapers.map((paper) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.id}`}
                className="block rounded border p-3 hover:bg-zinc-900"
              >
                <h3 className="font-medium">
                  {paper.title}
                </h3>

                <p className="text-xs text-gray-400">
                  {new Date(
                    paper.createdAt
                  ).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Comparisons */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Recent Comparisons
          </h2>

          <div className="space-y-3">
            {recentComparisons.map(
              (comparison) => (
                <Link
                  key={comparison.id}
                  href={`/comparisons/${comparison.id}`}
                  className="block rounded border p-3 hover:bg-zinc-900"
                >
                  <h3 className="font-medium">
                    {comparison.paperA.title}
                    {" vs "}
                    {comparison.paperB.title}
                  </h3>

                  <p className="text-xs text-gray-400">
                    {new Date(
                      comparison.createdAt
                    ).toLocaleString()}
                  </p>
                </Link>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}