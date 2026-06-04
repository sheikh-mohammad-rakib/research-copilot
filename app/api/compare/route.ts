import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ai } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { paperAId, paperBId } = await req.json();

    const paperA = await prisma.paper.findUnique({
      where: { id: paperAId },
    });

    const paperB = await prisma.paper.findUnique({
      where: { id: paperBId },
    });

    if (!paperA || !paperB) {
      return Response.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    const response = await ai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert research paper reviewer.",
        },
        {
          role: "user",
          content: `
Compare these two papers.

Return the response in markdown format.

# Overview

# Similarities

# Differences

# Strengths

# Weaknesses

# Verdict

Paper A Title:
${paperA.title}

Paper A Content:
${paperA.content.slice(0, 4000)}

Paper B Title:
${paperB.title}

Paper B Content:
${paperB.content.slice(0, 4000)}
`,
        },
      ],
    });

    const comparisonResult =
      response.choices[0].message.content ??
      "Comparison unavailable";

    const comparison =
      await prisma.comparison.create({
        data: {
          paperAId,
          paperBId,
          result: comparisonResult,
        },
      });

    return Response.json({
      success: true,
      comparisonId: comparison.id,
      comparison: comparisonResult,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Comparison failed",
      },
      {
        status: 500,
      }
    );
  }
}