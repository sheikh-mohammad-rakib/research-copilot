import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import PaperChat from "@/components/paper-chat";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaperPage({
  params,
}: PageProps) {
  const { id } = await params;

  const paper = await prisma.paper.findUnique({
    where: {
      id,
    },
  });

  if (!paper) {
    notFound();
  }

  return (
    <main className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {paper.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Uploaded on{" "}
          {new Date(
            paper.createdAt
          ).toLocaleString()}
        </p>
      </div>

      {/* AI Summary */}
      <section className="mb-8 rounded-xl border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          AI Summary
        </h2>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {paper.summary ??
              "No summary available."}
          </ReactMarkdown>
        </div>
      </section>

      {/* Ask Questions */}
      <div className="mb-8">
        <PaperChat paperId={paper.id} />
      </div>

      {/* Original Content */}
      <section className="rounded-xl border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Extracted Content
        </h2>

        <div className="max-h-[700px] overflow-y-auto rounded border p-4">
          <pre className="whitespace-pre-wrap text-sm">
            {paper.content}
          </pre>
        </div>
      </section>
    </main>
  );
}