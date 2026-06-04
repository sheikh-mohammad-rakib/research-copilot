import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PapersPage() {
  const papers = await prisma.paper.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Papers
      </h1>

      <div className="space-y-4">
        {papers.map((paper) => (
          <Link
            key={paper.id}
            href={`/papers/${paper.id}`}
            className="block rounded-xl border p-4 transition hover:bg-muted/50"
          >
            <h2 className="font-semibold">
              {paper.title}
            </h2>

            <p className="text-sm text-muted-foreground">
              {new Date(
                paper.createdAt
              ).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}