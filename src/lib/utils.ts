import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract and parse JSON from a Claude response that may be wrapped
 * in a markdown code block (```json ... ``` or ``` ... ```).
 */
export function parseClaudeJson<T>(raw: string): T {
  // Strip markdown code fences if present
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(stripped) as T;
}
