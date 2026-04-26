import {
  buildDialogReplySystemPrompt,
  buildDialogReplyUserPrompt,
} from "@/lib/prompts";
import {
  DialogReplyRequest,
  DialogReplyResult,
} from "@/lib/types";
import { generateJson } from "@/lib/llm";

const MAX_HISTORY = 12; // truncate long conversations to last N turns

export async function POST(req: Request) {
  const body = (await req.json()) as DialogReplyRequest;
  const { scenario, turns, newUserText } = body;

  if (!scenario || !newUserText?.trim()) {
    return Response.json(
      { error: "Missing scenario or newUserText" },
      { status: 400 }
    );
  }

  const recentTurns = turns.slice(-MAX_HISTORY);

  try {
    const result = await generateJson<DialogReplyResult>(
      buildDialogReplyUserPrompt(scenario, recentTurns, newUserText.trim()),
      {
        max_tokens: 2048,
        system: buildDialogReplySystemPrompt(scenario),
        cacheSystem: true,
      }
    );

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[dialog/reply] error:", msg);
    return Response.json(
      { error: "Dialog reply failed", detail: msg },
      { status: 500 }
    );
  }
}
