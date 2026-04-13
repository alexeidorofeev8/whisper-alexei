import Anthropic from "@anthropic-ai/sdk";
import { buildPhrasePrompt } from "@/lib/prompts";
import { TargetLanguage, TranslationDifficulty, TranslationPhrase } from "@/lib/types";
import { parseClaudeJson } from "@/lib/utils";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { difficulty = "medium", targetLanguage = "de", seed, usedPhrases = [] } = await req.json() as {
    difficulty?: TranslationDifficulty;
    targetLanguage?: TargetLanguage;
    seed?: number;
    usedPhrases?: string[];
  };

  const TOPICS = [
    "morning routine", "weekend plans", "favourite food", "a recent trip",
    "the weather today", "a childhood memory", "shopping", "a film or series",
    "a hobby", "work or study", "a friend or family member", "health habits",
    "a city or place", "music", "a problem to solve", "future dreams",
    "a funny situation", "technology", "nature and animals", "celebrations",
    "cooking a meal", "sport and exercise", "reading a book", "home life",
    "meeting someone new", "a surprise", "being tired or busy", "money",
    "a skill you want to learn", "giving advice",
  ];
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 64,
      messages: [
        {
          role: "user",
          content: buildPhrasePrompt(difficulty, targetLanguage, seed, topic, usedPhrases),
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
