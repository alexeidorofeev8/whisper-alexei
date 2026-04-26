import { buildTranslationEvalPrompt } from "@/lib/prompts";
import { TargetLanguage, TranslationDifficulty, TranslationResult } from "@/lib/types";
import { generateJson } from "@/lib/llm";

export async function POST(req: Request) {
  const { russian, userTranslation, targetLanguage = "de", difficulty = "medium" } =
    (await req.json()) as {
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
    const parsed = await generateJson<TranslationResult>(
      buildTranslationEvalPrompt(russian, userTranslation, targetLanguage, difficulty),
      { max_tokens: 1536 }
    );

    return Response.json(parsed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[translate] error:", msg);
    return Response.json({ error: "Translation evaluation failed", detail: msg }, { status: 500 });
  }
}
