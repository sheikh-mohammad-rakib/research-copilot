// lib/ai.ts
import OpenAI from "openai";

export const ai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.github.ai/inference",
});