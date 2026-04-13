export type ErrorType = "word_order" | "case" | "wrong_word" | "grammar";

export interface GrammarError {
  id: string;
  type: ErrorType;
  tokens: string[];
  original_indices: number[];
  correct_indices?: number[];
  correct_word?: string;
  explanation: string;
  rule_name: string;
}

export interface WordExample {
  word: string;
  examples: string[];
}

export interface AnalysisResult {
  original_tokens: string[];
  corrected: string;
  errors: GrammarError[];
  alternatives: string[];
  word_examples: WordExample[];
  ai_response: string;
  level_assessment: string;
  study_tip: string;
}

export type MessageRole = "user" | "analysis" | "ai";

export interface Message {
  id: string;
  role: MessageRole;
  timestamp: number;
  transcript?: string;
  analysis?: AnalysisResult;
  aiText?: string;
}

export type RecordingState = "idle" | "recording" | "processing" | "error";
