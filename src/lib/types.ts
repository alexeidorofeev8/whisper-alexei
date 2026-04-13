export type ErrorType =
  | "word_order"
  | "case"
  | "wrong_word"
  | "grammar"
  | "article"
  | "tense"
  | "preposition";

export interface GrammarError {
  id: string;
  type: ErrorType;
  tokens: string[];
  original_indices: number[];
  correct_indices?: number[];
  correct_word?: string;
  explanation: string;
  rule_name: string;
  examples?: string[];
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

export type TargetLanguage = "de" | "en";
export type TranslationDifficulty = "easy" | "medium" | "hard";

export interface TranslationPhrase {
  id: string;
  russian: string;
  difficulty: TranslationDifficulty;
  targetLanguage: TargetLanguage;
}

export interface TranslationResult {
  correct: boolean;
  corrected_translation: string;
  colloquial?: string;
  explanation_ru: string;
  score: "perfect" | "good" | "needs_work";
  errors: GrammarError[];
}

export type MessageRole = "user" | "analysis" | "ai" | "translation" | "phrase";

export interface Message {
  id: string;
  role: MessageRole;
  timestamp: number;
  transcript?: string;
  analysis?: AnalysisResult;
  aiText?: string;
  translationResult?: TranslationResult;
  phrase?: TranslationPhrase;
}

export type RecordingState = "idle" | "recording" | "processing" | "error";
