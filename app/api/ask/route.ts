import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ai } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { paperId, question } = await req.json();

    const paper = await prisma.paper.findUnique({
      where: {
        id: paperId,
      },
    });

    if (!paper) {
      return Response.json(
        {
          error: "Paper not found",
        },
        {
          status: 404,
        }
      );
    }

    const response =
      await ai.chat.completions.create({
        model: "openai/gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Answer questions only using the provided research paper content.",
          },
          {
            role: "user",
            content: `
Paper:

${paper.content.slice(0, 12000)}

Question:

${question}
`,
          },
        ],
      });

    return Response.json({
      answer:
        response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to answer question",
      },
      {
        status: 500,
      }
    );
  }
}