import Anthropic from "@anthropic-ai/sdk";
import { buildPhrasePrompt } from "@/lib/prompts";
import { TargetLanguage, TranslationDifficulty, TranslationPhrase } from "@/lib/types";
import { parseClaudeJson } from "@/lib/utils";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { difficulty = "medium", targetLanguage = "de" } = await req.json() as {
    difficulty?: TranslationDifficulty;
    targetLanguage?: TargetLanguage;
  };

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: buildPhrasePrompt(difficulty, targetLanguage),
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: { russian: string };
    try {
      parsed = parseClaudeJson<{ russian: string }>(raw);
    } catch {
      console.error("Raw Claude response:", raw);
      return Response.json(
        { error: "Invalid JSON from Claude", raw },
        { status: 500 }
      );
    }

    const phrase: TranslationPhrase = {
      id: crypto.randomUUID(),
      russian: parsed.russian,
      difficulty,
      targetLanguage,
    };

    return Response.json(phrase);
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json({ error: "Phrase generation failed" }, { status: 500 });
  }
}
