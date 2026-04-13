import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { AnalysisResult } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { transcript } = await req.json();

  if (!transcript?.trim()) {
    return Response.json({ error: "No transcript provided" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(transcript),
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "Invalid JSON from Claude", raw },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
