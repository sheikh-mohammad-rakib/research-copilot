import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ComparisonPage({
  params,
}: PageProps) {
  const { id } = await params;

  const comparison =
    await prisma.comparison.findUnique({
      where: {
        id,
      },
      include: {
        paperA: true,
        paperB: true,
      },
    });

  if (!comparison) {
    notFound();
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-4 text-4xl font-bold">
        {comparison.paperA.title}
        {" vs "}
        {comparison.paperB.title}
      </h1>

      <p className="mb-8 text-sm text-gray-400">
        {new Date(
          comparison.createdAt
        ).toLocaleString()}
      </p>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
        >
          {comparison.result}
        </ReactMarkdown>
      </div>
    </main>
  );
}