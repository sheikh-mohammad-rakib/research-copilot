import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.github.ai/inference",
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful research assistant.",
        },
        {
          role: "user",
          content:
            "Summarize the benefits of electric vehicles in 3 bullet points.",
        },
      ],
    });

    return Response.json({
      success: true,
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}