import { buildPhrasePrompt } from "@/lib/prompts";
import { TargetLanguage, TranslationDifficulty, TranslationPhrase } from "@/lib/types";
import { generateJson } from "@/lib/llm";

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

export async function POST(req: Request) {
  const { difficulty = "medium", targetLanguage = "de", seed, usedPhrases = [] } = await req.json() as {
    difficulty?: TranslationDifficulty;
    targetLanguage?: TargetLanguage;
    seed?: number;
    usedPhrases?: string[];
  };

  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

  try {
    const parsed = await generateJson<{ russian: string }>(
      buildPhrasePrompt(difficulty, targetLanguage, seed, topic, usedPhrases),
      { model: "claude-haiku-4-5-20251001", max_tokens: 256 }
    );

    const phrase: TranslationPhrase = {
      id: crypto.randomUUID(),
      russian: parsed.russian,
      difficulty,
      targetLanguage,
    };

    return Response.json(phrase);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[phrase] error:", msg);
    return Response.json({ error: "Phrase generation failed", detail: msg }, { status: 500 });
  }
}
