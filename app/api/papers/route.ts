import { prisma } from "@/lib/db";

export async function GET() {
  const papers = await prisma.paper.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  return Response.json(papers);
}