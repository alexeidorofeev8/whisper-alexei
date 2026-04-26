/**
 * LLM backend abstraction.
 *
 * Switchable via env var LLM_BACKEND:
 *   - "anthropic-api" (default): uses ANTHROPIC_API_KEY, calls API directly
 *   - "claude-cli": spawns local `claude --print` subprocess, uses Pro/Max
 *     subscription quota (free for the user). Only works locally where the
 *     Claude Code CLI is installed and authenticated.
 *
 * Used by all API routes: analyze, translate, phrase, correct.
 */

import Anthropic from "@anthropic-ai/sdk";
import { spawn } from "node:child_process";
import { parseClaudeJson } from "./utils";

export type LlmBackend = "anthropic-api" | "claude-cli";

export function activeBackend(): LlmBackend {
  return process.env.LLM_BACKEND === "claude-cli" ? "claude-cli" : "anthropic-api";
}

const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TOKENS = 2048;

export interface GenerateOptions {
  model?: string;
  max_tokens?: number;
  system?: string;
  /** Use ephemeral cache on system block (only applies to anthropic-api backend). */
  cacheSystem?: boolean;
}

let _apiClient: Anthropic | null = null;
function apiClient(): Anthropic {
  if (!_apiClient) {
    _apiClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });
  }
  return _apiClient;
}

async function viaApi(prompt: string, opts: GenerateOptions): Promise<string> {
  const systemBlocks =
    opts.system != null
      ? [
          opts.cacheSystem
            ? { type: "text" as const, text: opts.system, cache_control: { type: "ephemeral" as const } }
            : { type: "text" as const, text: opts.system },
        ]
      : undefined;

  const message = await apiClient().messages.create({
    model: opts.model ?? DEFAULT_MODEL,
    max_tokens: opts.max_tokens ?? DEFAULT_MAX_TOKENS,
    ...(systemBlocks ? { system: systemBlocks } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

async function viaCli(prompt: string, opts: GenerateOptions): Promise<string> {
  const fullPrompt = opts.system ? `${opts.system}\n\n${prompt}` : prompt;
  const cmd = process.platform === "win32" ? "claude.cmd" : "claude";

  return new Promise<string>((resolve, reject) => {
    let proc;
    try {
      proc = spawn(cmd, ["--print"], { stdio: ["pipe", "pipe", "pipe"], shell: process.platform === "win32" });
    } catch (e) {
      reject(new Error(`Failed to spawn '${cmd}'. Install Claude Code CLI and run 'claude login'. (${(e as Error).message})`));
      return;
    }

    let out = "";
    let err = "";
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.stderr.on("data", (d: Buffer) => (err += d.toString()));
    proc.on("error", (e) =>
      reject(new Error(`Failed to spawn '${cmd}'. Install Claude Code CLI and run 'claude login'. (${e.message})`))
    );
    proc.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`claude CLI exited ${code}: ${err.trim() || out.trim()}`));
    });

    proc.stdin.write(fullPrompt);
    proc.stdin.end();
  });
}

export async function generateText(prompt: string, opts: GenerateOptions = {}): Promise<string> {
  const backend = activeBackend();
  return backend === "claude-cli" ? viaCli(prompt, opts) : viaApi(prompt, opts);
}

export async function generateJson<T>(prompt: string, opts: GenerateOptions = {}): Promise<T> {
  const text = await generateText(prompt, opts);
  return parseClaudeJson<T>(text);
}
