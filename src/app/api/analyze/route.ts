import { getSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { AnalysisResult, TargetLanguage } from "@/lib/types";
import { generateJson } from "@/lib/llm";

export async function POST(req: Request) {
  const { transcript, targetLanguage = "de" } = (await req.json()) as {
    transcript: string;
    targetLanguage?: TargetLanguage;
  };

  if (!transcript?.trim()) {
    return Response.json({ error: "No transcript provided" }, { status: 400 });
  }

  try {
    const parsed = await generateJson<AnalysisResult>(
      buildUserPrompt(transcript, targetLanguage),
      {
        max_tokens: 2048,
        system: getSystemPrompt(targetLanguage),
        cacheSystem: true,
      }
    );

    return Response.json(parsed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[analyze] error:", msg);
    return Response.json({ error: "Analysis failed", detail: msg }, { status: 500 });
  }
}
