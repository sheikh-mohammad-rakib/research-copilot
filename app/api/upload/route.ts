import { NextRequest } from "next/server";
import pdf from "pdf-parse";

import { prisma } from "@/lib/db";
import { ai } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdf(buffer);

    const content = pdfData.text.slice(0, 12000);

    const aiResponse =
      await ai.chat.completions.create({
        model: "openai/gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert research assistant. Summarize research papers clearly.",
          },
          {
            role: "user",
            content: `
Summarize this research paper.

Return markdown using exactly this format:

# TLDR

Short summary

# Key Points

- Point 1
- Point 2
- Point 3

# Important Findings

- Finding 1
- Finding 2
- Finding 3

Paper:

${content}
`,
          },
        ],
      });

    const summary =
      aiResponse.choices[0]?.message?.content ??
      "Summary unavailable";

    const paper = await prisma.paper.create({
      data: {
        title: file.name.replace(".pdf", ""),
        content: pdfData.text,
        summary,
      },
    });

    return Response.json({
      success: true,
      paper,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to process PDF",
      },
      {
        status: 500,
      }
    );
  }
}