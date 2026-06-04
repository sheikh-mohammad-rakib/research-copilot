import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const count = await prisma.paper.count();

    return Response.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error: String(error),
    });
  }
}