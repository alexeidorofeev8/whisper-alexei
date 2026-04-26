import { buildScenarioPrompt } from "@/lib/prompts";
import { Difficulty, Scenario, ScenarioRequest } from "@/lib/types";
import { generateJson } from "@/lib/llm";

export async function POST(req: Request) {
  const body = (await req.json()) as ScenarioRequest;
  const difficulty: Difficulty = body.difficulty ?? "medium";
  const avoid = body.avoid ?? [];

  try {
    const result = await generateJson<Scenario>(
      buildScenarioPrompt(difficulty, avoid),
      { model: "claude-haiku-4-5-20251001", max_tokens: 400 }
    );

    // Defensive normalisation: enforce difficulty on output
    result.difficulty = difficulty;

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[scenario] error:", msg);
    return Response.json(
      { error: "Scenario generation failed", detail: msg },
      { status: 500 }
    );
  }
}
