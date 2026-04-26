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

export type AppMode = "dialog" | "correction" | "progress";

export type Difficulty = "easy" | "medium" | "hard";

export interface Scenario {
  role: string;
  situation: string;
  difficulty: Difficulty;
  opener: string;
}

export type DialogTurnRole = "user" | "assistant";

export interface DialogTurn {
  id: string;
  role: DialogTurnRole;
  text: string;
  analysis?: AnalysisResult;
  timestamp: number;
}

export interface DialogChat {
  id: string;
  scenario: Scenario;
  title: string;
  turns: DialogTurn[];
  createdAt: number;
  updatedAt: number;
}

export interface ScenarioRequest {
  difficulty?: Difficulty;
  avoid?: { role: string; situation: string }[];
}

export interface DialogReplyRequest {
  scenario: Scenario;
  turns: DialogTurn[];
  newUserText: string;
}

export interface DialogReplyResult {
  analysis: AnalysisResult;
  reply: string;
}

export interface CorrectionRequest {
  text: string;
}

export interface CorrectionResult {
  corrected: string;
  native_variant?: string;
  notes: string[];
  tip?: string;
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
