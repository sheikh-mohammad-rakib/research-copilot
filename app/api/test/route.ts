import { prisma } from "@/lib/db";

export async function GET() {
  const papers = await prisma.paper.findMany();

  return Response.json({
    success: true,
    count: papers.length,
    papers,
  });
}