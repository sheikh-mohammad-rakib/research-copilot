import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ComparisonsPage() {
  const comparisons =
    await prisma.comparison.findMany({
      include: {
        paperA: true,
        paperB: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (comparisons.length === 0) {
    return (
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Comparison History
          </h1>

          <p className="mt-2 text-gray-400">
            View previously generated
            AI comparisons.
          </p>
        </div>

        <div className="rounded-xl border p-10 text-center">
          <h2 className="mb-3 text-xl font-semibold">
            No comparisons yet
          </h2>

          <p className="mb-6 text-gray-400">
            Compare two research papers to
            start building comparison
            history.
          </p>

          <Link
            href="/compare"
            className="rounded-lg border px-4 py-2"
          >
            Compare Papers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Comparison History
        </h1>

        <p className="mt-2 text-gray-400">
          Browse all AI-generated paper
          comparisons.
        </p>
      </div>

      <div className="space-y-4">
        {comparisons.map((comparison) => (
          <Link
            key={comparison.id}
            href={`/comparisons/${comparison.id}`}
            className="block rounded-xl border p-5 transition hover:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold">
              {comparison.paperA.title}
              {" vs "}
              {comparison.paperB.title}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Compared on{" "}
              {new Date(
                comparison.createdAt
              ).toLocaleString()}
            </p>

            <p className="mt-3 text-sm text-blue-400">
              View Comparison →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}