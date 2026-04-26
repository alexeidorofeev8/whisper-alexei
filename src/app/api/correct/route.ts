import { buildCorrectionPrompt } from "@/lib/prompts";
import { CorrectionRequest, CorrectionResult } from "@/lib/types";
import { activeBackend, generateJson } from "@/lib/llm";

export async function POST(req: Request) {
  const { text } = (await req.json()) as CorrectionRequest;

  if (!text?.trim()) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const result = await generateJson<CorrectionResult>(buildCorrectionPrompt(text), {
      max_tokens: 1500,
    });

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[correct] backend:", activeBackend(), "error:", msg);
    return Response.json(
      { error: "Correction failed", detail: msg, backend: activeBackend() },
      { status: 500 }
    );
  }
}
