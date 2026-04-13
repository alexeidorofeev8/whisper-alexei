import Anthropic from "@anthropic-ai/sdk";
import { buildTranslationEvalPrompt } from "@/lib/prompts";
import { TargetLanguage, TranslationDifficulty, TranslationResult } from "@/lib/types";
import { parseClaudeJson } from "@/lib/utils";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { russian, userTranslation, targetLanguage = "de", difficulty = "medium" } =
    await req.json() as {
      russian: string;
      userTranslation: string;
      targetLanguage?: TargetLanguage;
      difficulty?: TranslationDifficulty;
    };

  if (!russian?.trim() || !userTranslation?.trim()) {
    return Response.json(
      { error: "Missing russian or userTranslation" },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1536,
      messages: [
        {
          role: "user",
          content: buildTranslationEvalPrompt(russian, userTranslation, targetLanguage, difficulty),
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: TranslationResult;
    try {
      parsed = parseClaudeJson<TranslationResult>(raw);
    } catch {
      console.error("Raw Claude response:", raw);
      return Response.json(
        { error: "Invalid JSON from Claude", raw },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json({ error: "Translation evaluation failed" }, { status: 500 });
  }
}
