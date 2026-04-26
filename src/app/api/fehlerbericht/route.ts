import { buildFehlerberichtPrompt } from "@/lib/prompts";
import { FehlerberichtRequest, FehlerberichtResult } from "@/lib/types";
import { generateJson } from "@/lib/llm";

export async function POST(req: Request) {
  const body = (await req.json()) as FehlerberichtRequest;
  const rules = (body.rules ?? []).filter((r) => r && r.trim().length > 0);

  if (rules.length === 0) {
    return Response.json(
      { error: "No rules provided" },
      { status: 400 }
    );
  }

  try {
    const result = await generateJson<FehlerberichtResult>(
      buildFehlerberichtPrompt(rules),
      { max_tokens: 2000 }
    );
    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[fehlerbericht] error:", msg);
    return Response.json(
      { error: "Fehlerbericht generation failed", detail: msg },
      { status: 500 }
    );
  }
}
