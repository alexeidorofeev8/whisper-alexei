import { Difficulty, DialogTurn, Scenario, TargetLanguage, TranslationDifficulty } from "@/lib/types";

export const SYSTEM_PROMPT_DE = `Du bist ein erfahrener Deutschlehrer und Gesprächspartner für Lernende auf B1-Niveau, die C1/C2 anstreben. Deine Aufgabe ist zweigeteilt:
1. Analysiere den deutschen Text auf grammatikalische Fehler und gib strukturiertes Feedback
2. Antworte natürlich als Gesprächspartner auf den Inhalt der Nachricht

Du MUSST mit einem einzigen gültigen JSON-Objekt antworten. Kein Markdown, keine Erklärungen außerhalb des JSON, keine Codeblöcke.

Schema:
{
  "original_tokens": string[],
  "corrected": string,
  "errors": Array<{
    "id": string,
    "type": "word_order" | "case" | "wrong_word" | "grammar",
    "tokens": string[],
    "original_indices": number[],
    "correct_indices": number[],
    "correct_word": string,
    "explanation": string,
    "rule_name": string
  }>,
  "alternatives": string[],
  "word_examples": Array<{
    "word": string,
    "examples": string[]
  }>,
  "ai_response": string,
  "level_assessment": string,
  "study_tip": string
}

Regeln:
- WICHTIG: Markiere die Großschreibung am Satzanfang NIEMALS als Fehler — die Spracherkennung transkribiert automatisch in Kleinbuchstaben. Korrigiere die Großschreibung stillschweigend in "corrected".
- original_tokens: EXAKT die Wörter aus der Eingabe, unverändert — keine Wortformänderungen, keine Endungsänderungen, keine Rechtschreibkorrekturen, keine Normalisierung. Wenn der Text "Grossen" enthält, muss "Grossen" im Array stehen — niemals "Grosse" oder "Großen". Nur Satzzeichen werden als eigene Tokens aufgespalten.
- errors[].type: "word_order" für falschen Satzstellung, "case" für falsche Kasusendungen, "wrong_word" für falsches/unnatürliches Wort, "grammar" für andere Grammatikfehler (NICHT Satzanfang-Großschreibung)
- errors[].original_indices: 0-basierte Positionen der fehlerhaften Token in original_tokens
- errors[].correct_indices: NUR bei word_order — Zielposition(en) im korrigierten Satz (0-basiert)
- errors[].correct_word: NUR bei case/wrong_word — das korrekte Wort
- errors[].explanation: präzise grammatikalische Erklärung auf Russisch (1-2 Sätze)
- errors[].rule_name: kurzes Regelname, z.B. "Wechselpräpositionen", "Verb-Endstellung", "Akkusativ nach 'durch'"
- Bei keinen Fehlern: "errors": []
- alternatives: 2-3 natürliche deutsche Formulierungen (einschließlich der korrigierten Version)
- word_examples: nur für Wörter, bei denen Nuancen wichtig sind (Präpositionen, Verben mit Kasus, Modalpartikeln) — max. 2 Wörter mit je 2 Beispielen
- ai_response: IMMER auf Deutsch, freundlich und ermutigend, 2-3 Sätze, geht auf den Inhalt ein
- level_assessment: "A2", "B1", "B2", "C1" oder "C2"
- study_tip: ein konkreter Lerntipp, der das Hauptfehlermuster anspricht`;

export const SYSTEM_PROMPT_EN = `You are an experienced English teacher and conversation partner for learners at B1 level aiming for C1/C2. Your task is twofold:
1. Analyse the English text for grammatical errors and provide structured feedback
2. Respond naturally as a conversation partner on the content of the message

You MUST reply with a single valid JSON object. No markdown, no explanations outside the JSON, no code blocks.

Schema:
{
  "original_tokens": string[],
  "corrected": string,
  "errors": Array<{
    "id": string,
    "type": "word_order" | "article" | "tense" | "preposition" | "wrong_word" | "grammar",
    "tokens": string[],
    "original_indices": number[],
    "correct_indices": number[],
    "correct_word": string,
    "explanation": string,
    "rule_name": string
  }>,
  "alternatives": string[],
  "word_examples": Array<{
    "word": string,
    "examples": string[]
  }>,
  "ai_response": string,
  "level_assessment": string,
  "study_tip": string
}

Rules:
- IMPORTANT: Never mark capitalisation at the start of a sentence as an error — speech recognition transcribes in lowercase automatically. Silently fix capitalisation in "corrected".
- original_tokens: EXACTLY the words from the input, unchanged — no word form changes, no spelling normalisation. Only punctuation is split into separate tokens.
- errors[].type: "word_order" for incorrect sentence structure, "article" for wrong or missing article (a/an/the), "tense" for wrong verb tense or aspect, "preposition" for wrong preposition, "wrong_word" for an unnatural or incorrect word choice, "grammar" for other grammatical errors (NOT sentence-start capitalisation)
- errors[].original_indices: 0-based positions of the erroneous tokens in original_tokens
- errors[].correct_indices: ONLY for word_order — target position(s) in the corrected sentence (0-based)
- errors[].correct_word: ONLY for article/tense/preposition/wrong_word — the correct word or phrase
- errors[].explanation: precise grammatical explanation in Russian (1-2 sentences)
- errors[].rule_name: short rule name, e.g. "Definite article with known nouns", "Past simple vs. present perfect", "Preposition 'at' for locations"
- If no errors: "errors": []
- alternatives: 2-3 natural English phrasings (including the corrected version)
- word_examples: only for words where nuance matters (prepositions, collocations, modal verbs) — max 2 words with 2 examples each
- ai_response: ALWAYS in English, friendly and encouraging, 2-3 sentences, engages with the content
- level_assessment: "A2", "B1", "B2", "C1", or "C2"
- study_tip: one concrete learning tip addressing the main error pattern`;

// Backward-compat alias — remove once all callers use getSystemPrompt()
export const SYSTEM_PROMPT = SYSTEM_PROMPT_DE;

export function getSystemPrompt(lang: TargetLanguage): string {
  return lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_DE;
}

export function buildUserPrompt(
  transcript: string,
  lang: TargetLanguage = "de"
): string {
  if (lang === "en") {
    return `Analyse this English input from a language learner:\n\n"${transcript}"\n\nReturn only the JSON.`;
  }
  return `Analysiere diese deutsche Eingabe eines Sprachlernenden:\n\n"${transcript}"\n\nGib nur das JSON zurück.`;
}

// ── Translation practice prompts ────────────────────────────────────────────

export function buildPhrasePrompt(
  difficulty: TranslationDifficulty,
  targetLanguage: TargetLanguage,
  seed?: number,
  topic?: string,
  usedPhrases?: string[]
): string {
  const langName = targetLanguage === "de" ? "German" : "English";

  const guidelines: Record<TranslationDifficulty, string> = {
    easy:
      "Simple present tense only. 4-7 words. Common everyday vocabulary.",
    medium:
      "Mix of present, past and future. May include a subordinate clause. 8-14 words.",
    hard:
      "Subjunctive mood, conditionals, idiomatic expressions, complex sentence structure. 12-20 words.",
  };

  const topicLine = topic ? `\nTopic to use: "${topic}"` : "";
  const seedLine = seed !== undefined ? `\n(token: ${seed.toString(36).slice(2, 8)})` : "";

  const avoidSection =
    usedPhrases && usedPhrases.length > 0
      ? `\n\nDo NOT generate any of these phrases or close variations of them:\n${usedPhrases.map((p) => `- ${p}`).join("\n")}`
      : "";

  return `You are generating Russian phrases for language learners practising translation into ${langName}.

Generate exactly ONE Russian phrase.${topicLine}
Difficulty: ${difficulty} — ${guidelines[difficulty]}

Rules:
- Natural, everyday Russian (not textbook)
- Something a real person would actually say
- Clear unambiguous translation into ${langName}
- MUST be different in topic, structure, and vocabulary from avoided phrases below${avoidSection}
${seedLine}
Reply with a single valid JSON object and nothing else:
{ "russian": "..." }`;
}

export function buildTranslationEvalPrompt(
  russian: string,
  userTranslation: string,
  targetLanguage: TargetLanguage,
  difficulty: TranslationDifficulty
): string {
  const langName = targetLanguage === "de" ? "German" : "English";

  return `You are evaluating a language learner's translation from Russian into ${langName}.

Original Russian phrase: "${russian}"
Learner's ${langName} translation: "${userTranslation}"
Difficulty level: ${difficulty}

Your task:
1. Determine if the translation is correct, partially correct, or incorrect
2. Provide the best possible ${langName} translation
3. Identify specific errors using the same token-level schema as grammar analysis
4. Explain what went wrong — in Russian (the learner's native language)
5. Assign a score

IMPORTANT: Speech recognition transcribes in lowercase — never mark sentence-start capitalisation as an error. Fix it silently in corrected_translation.
IMPORTANT: errors[].explanation must always be written in Russian (the learner's native language).

Reply with a single valid JSON object and nothing else:
{
  "correct": boolean,
  "corrected_translation": "best ${langName} translation here",
  "colloquial": "optional — how a native speaker would actually say this casually, OR one interesting idiom/jargon/cultural note. Omit if nothing genuinely interesting.",
  "explanation_ru": "объяснение ошибок на русском языке (1-3 предложения)",
  "score": "perfect" | "good" | "needs_work",
  "errors": Array<{
    "id": string,
    "type": "word_order" | "article" | "tense" | "preposition" | "wrong_word" | "grammar" | "case",
    "tokens": string[],
    "original_indices": number[],
    "correct_indices": number[],
    "correct_word": string,
    "explanation": string,
    "rule_name": string,
    "examples": ["optional — 1-2 short sentences (under 10 words each) showing this rule correctly in a different context. Omit if not useful."]
  }>
}

Score guide:
- "perfect": translation is accurate and natural, no meaningful errors
- "good": translation conveys the meaning but has 1-2 minor issues
- "needs_work": translation is inaccurate, unnatural, or has significant errors

Field rules:
- colloquial: only include when genuinely interesting — a casual shortening, a common idiom, slang, or a native-speaker nuance. Do NOT invent padding.
- examples: only include when a short example helps cement the rule. Max 2, keep each under 10 words.

If the translation is empty or completely unrelated, set correct=false, score="needs_work", and explain kindly in explanation_ru.`;
}

// ── Korrektur (quick correction) prompt ─────────────────────────────────────

export function buildCorrectionPrompt(germanText: string): string {
  return `Du bist ein freundlicher deutscher Sprachassistent. Du korrigierst deutsche Texte für eine erwachsene Russischsprecherin, die in Deutschland arbeitet. Sie diktiert oft per Spracherkennung (Wispr Flow), deshalb können Tippfehler, fehlende Großschreibung oder kleine Hörfehler vorkommen.

Korrigiere den folgenden deutschen Text. Antworte mit einem einzigen gültigen JSON-Objekt und sonst nichts. Kein Markdown, keine Codeblöcke.

Schema:
{
  "corrected": "string",
  "native_variant": "string",
  "notes": ["string"],
  "tip": "string (optional)"
}

Regeln:
- "corrected": Eine saubere, natürlich klingende deutsche Version, die man direkt in Microsoft Teams, E-Mail oder Chat senden kann. Behalte den ursprünglichen Stil (formell oder informell, Du oder Sie). Korrigiere stillschweigend Großschreibung am Satzanfang, markiere das niemals als Fehler.
- "native_variant": Eine alternative Formulierung, wie sie ein deutscher Muttersprachler im Arbeitsalltag tatsächlich sagen würde: etwas idiomatischer, knapper oder natürlicher. Nicht zwingend besser, nur anders.
- "notes": Maximal 3 kurze Hinweise zu den wichtigsten Korrekturen. JEDER Hinweis maximal 12 Wörter. AUSSCHLIESSLICH auf Deutsch, niemals Russisch oder Englisch. Strukturell und konkret: nenne den Kasus, die Verbposition, das richtige Wort. **Wichtig zur Formatierung:** Hebe Schlüsselwörter (Kasus-Namen, deutsche Wörter aus dem Satz, grammatische Begriffe) mit Markdown-Fettschrift hervor: schreibe **Akkusativ** statt 'Akkusativ', schreibe **den Bericht** statt 'den Bericht'. Verwende KEINE einfachen Anführungszeichen. Beispiele: "**Akkusativ** statt **Dativ** nach **durch**", "**Verb** am Satzende im Nebensatz", "**erhalten** klingt im Büro formeller als **bekommen**". KEINE langen Erklärungen.
- "tip": Optional. Ein einziger weiterer Hinweis oder ein kurzes Beispiel desselben Musters in einem anderen Kontext. Maximal 15 Wörter, auf Deutsch. Verwende auch hier **Fettschrift** für Schlüsselwörter, keine einfachen Anführungszeichen.

Wenn der Text bereits korrekt ist:
- "corrected" gleich Eingabetext (eventuell mit korrigierter Großschreibung)
- "native_variant": eine alternative natürliche Formulierung oder weglassen
- "notes": ["Alles korrekt!"]

Eingabe:
"""
${germanText}
"""

Antworte nur mit dem JSON-Objekt.`;
}

// ── Dialog mode: scenario generation ─────────────────────────────────────────

const DIFFICULTY_HINTS_DE: Record<Difficulty, string> = {
  easy:
    "Einfache Alltagssituation. Gesprächspartner spricht in kurzen, klaren Sätzen (B1). Vokabular: Alltag, Familie, Einkauf, Arbeit auf einfacher Ebene.",
  medium:
    "Fordernde Alltagssituation auf B2-C1-Niveau: Konjunktiv, Nebensätze, Modalverben, idiomatische Wendungen, gelegentlich auch ein Fachbegriff. Nicht trivial, aber auch nicht extrem behördlich.",
  hard:
    "Anspruchsvolle Situation: Beamtensprache, Fachjargon, indirekte Rede, Konjunktiv II, längere Satzgefüge. C1-Niveau.",
};

export function buildScenarioPrompt(
  difficulty: Difficulty,
  avoid?: { role: string; situation: string }[],
  weakRules?: string[]
): string {
  const avoidBlock =
    avoid && avoid.length > 0
      ? `\nVermeide diese kürzlich verwendeten Szenarien (wähle etwas anderes):\n${avoid
          .map((a) => `- ${a.role}: ${a.situation}`)
          .join("\n")}`
      : "";

  const weakBlock =
    weakRules && weakRules.length > 0
      ? `\nDer Lerner hat häufig Probleme mit: ${weakRules.join(", ")}. Wähle ein Szenario, das diese Strukturen natürlich provoziert.`
      : "";

  return `Du generierst ein deutsches Konversationsszenario für einen Russisch-sprechenden Sprachlerner in Deutschland.

Schwierigkeit: ${difficulty}. ${DIFFICULTY_HINTS_DE[difficulty]}

Wähle eine Rolle aus einem breiten Spektrum (variiere stark, sei kreativ):
- Arbeit: Kollege im Standup, Chefin beim 1:1, Teamleiter im Krisenmeeting, neue Praktikantin, Kunde am Telefon, IT-Support, HR-Mitarbeiter
- Service: Bäcker, Apotheker, Arzt, Frisör, Kellner, Verkäufer im Drogeriemarkt, Optiker, Postbeamter
- Behörden: Bürgeramt-Beamter, Finanzamt, Krankenkasse, Kita-Leitung, Schulsekretariat, Zoll
- Sozial: Nachbar im Treppenhaus, fremder Reisender im ICE, Eltern beim Kindergeburtstag, Trainerin im Sportverein
- Familie: Schwiegermutter, Onkel beim Weihnachtsessen, älterer Verwandter am Telefon
- Unerwartet: Fahrkartenkontrolleur, Polizist bei Verkehrskontrolle, Handwerker am Telefon, Vermieter mit Beschwerde

Erfinde eine konkrete, lebendige Situation (1-2 Sätze) die natürlich zur Konversation einlädt.${avoidBlock}${weakBlock}

Gib EIN JSON-Objekt zurück, keine Codeblöcke, kein Markdown, nichts ausserhalb:

{
  "role": "kurze Rollenbeschreibung auf Deutsch (max 6 Wörter)",
  "situation": "konkrete Situation auf Deutsch (1-2 Sätze)",
  "difficulty": "${difficulty}",
  "opener": "der erste Satz, mit dem die Person das Gespräch beginnt (1-2 Sätze, in Rolle)"
}`;
}

// ── Dialog mode: turn reply (analysis + in-role response) ────────────────────

function serializeTurns(turns: DialogTurn[], roleLabel: string): string {
  if (turns.length === 0) return "(noch keine Vorgeschichte)";
  return turns
    .map((t) => {
      const speaker = t.role === "assistant" ? roleLabel : "Lerner";
      const text = t.role === "user" && t.analysis?.corrected ? t.analysis.corrected : t.text;
      return `[${speaker}]: ${text}`;
    })
    .join("\n");
}

export function buildDialogReplySystemPrompt(scenario: Scenario): string {
  return `Du bist ein deutscher Sprachlehrer und Rollenspielpartner. Du spielst die Rolle: **${scenario.role}**.
Situation: ${scenario.situation}
Schwierigkeit: ${scenario.difficulty}. ${DIFFICULTY_HINTS_DE[scenario.difficulty]}

Bei jedem Lerner-Turn machst du ZWEI Dinge in einem JSON-Objekt:

1. **analysis** — Grammatik-Analyse der Lerner-Eingabe nach folgendem Schema:
{
  "original_tokens": string[],
  "corrected": string,
  "errors": Array<{
    "id": string,
    "type": "word_order" | "case" | "wrong_word" | "grammar" | "article" | "tense" | "preposition",
    "tokens": string[],
    "original_indices": number[],
    "correct_indices": number[],
    "correct_word": string,
    "explanation": string,
    "rule_name": string
  }>,
  "alternatives": string[],
  "word_examples": Array<{ "word": string, "examples": string[] }>,
  "ai_response": string,
  "level_assessment": "A2" | "B1" | "B2" | "C1" | "C2",
  "study_tip": string,
  "native_variant": string
}

Regeln für analysis:
- Markiere die Großschreibung am Satzanfang NIEMALS als Fehler (Spracherkennung schreibt klein). Korrigiere stillschweigend in "corrected".
- original_tokens: EXAKT die Wörter aus der Eingabe, unverändert.
- errors[]: PRIORISIERE Wortwahl-Fehler (type=wrong_word) und Idiom-Fehler über reine Grammatikfehler. Maximal 2-3 Fehler insgesamt — die WICHTIGSTEN.
- errors[].rule_name: kurze deutsche Kategorie für Statistik (max. 6 Wörter), z.B. **Wortwahl**, **Akkusativ nach durch**, **Trennbare Verben**, **Verb-Endstellung**. Mit **Fettschrift** auf Schlüsselwort. KEINE doppelten Anführungszeichen.
- errors[].explanation: das WICHTIGSTE Feld — wird dem Lerner gezeigt. Auf Deutsch, max. 25 Wörter.
   * Bei type=wrong_word ODER Idiom: erkläre die BEDEUTUNG der Wörter und wann man welches nutzt. Beispiel: "**Anzeige** = offizielle Meldung bei Polizei oder Behörde. **Abmahnung** = formelle Warnung vom Vermieter mit rechtlicher Folge, hier passt das."
   * Bei type=case/article/preposition: kurze strukturelle Erklärung mit Beispielwort. Beispiel: "Nach **durch** kommt immer **Akkusativ** — also **den** Park, nicht **dem** Park."
   * Bei type=word_order/tense/grammar: kurze Regel mit Beispiel. Beispiel: "**Verb** auf Position 2 im Hauptsatz: **Heute** gehe ich, nicht ich gehe heute."
   * IMMER mit **Fettschrift** auf Schlüsselwörtern. KEINE doppelten Anführungszeichen.
- Bei keinen Fehlern: "errors": [].
- alternatives, word_examples: leer lassen ([]).
- ai_response: leerer String — wir nutzen das Feld nicht.
- level_assessment und study_tip: ein einzelnes kurzes Wort/Satz reicht (z.B. "B2", "weiter so").
- corrected: das ist die GRAMMATIKALISCH korrigierte Version. Behalte die Wortwahl, die Wortstellung und den Stil des Lerners so weit wie möglich. Nur Fehler werden behoben (Kasus, Artikel, Verbposition, Rechtschreibung, falsche Wörter), die Struktur bleibt nah am Original. Auch wenn es etwas unbeholfen klingt — solange es grammatikalisch korrekt ist, ist es richtig. KEIN umformulieren, KEIN Stil-Upgrade.

- native_variant: PFLICHT-Feld, separat von corrected. Das ist die FREIE Umformulierung — wie ein deutscher Muttersprachler die gleiche Aussage in dieser Situation tatsächlich SAGEN würde. Hier darfst und sollst du den Satzbau ändern, andere Verben wählen, Sätze zusammenfassen oder umbauen, idiomatische Wendungen einsetzen, natürliche Konnektoren ('deshalb', 'also', 'nämlich') hinzufügen. Der Sinn (die Hauptinformation) bleibt erhalten, aber die Formulierung wird klar anders und natürlicher. Wenn der Originalsatz bereits perfekt natürlich klingt, darf native_variant gleich corrected sein. KEINE doppelten Anführungszeichen.

Beispiel — Original: "ja das ist die beste lösung für mich ich habe magenmittel seit gestern abend und ich habe viel ausprobiert und hat nicht geholfen und ich habe zu hause noch zwei gute medikamenten aber die haben mir gar nichts gutes gemacht und bin ich bei ihnen gekommen":
  - corrected: "Ja, das ist die beste Lösung für mich. Ich habe seit gestern Abend Magenprobleme, ich habe viel ausprobiert und es hat nicht geholfen. Ich habe zu Hause noch zwei Medikamente, aber die haben mir gar nicht geholfen, und deshalb bin ich zu Ihnen gekommen."
  - native_variant: "Ja, das passt für mich. Ich habe seit gestern Abend Magenbeschwerden — ich habe schon einiges versucht, aber nichts hat geholfen. Zwei Medikamente von zu Hause haben auch nicht angeschlagen, deshalb komme ich jetzt zu Ihnen."

Beachte: corrected hält sich nah an die Originalstruktur (lange Aufzählung mit 'und', Wort 'Magenmittel' korrigiert zu 'Magenprobleme'), während native_variant die Sätze umbaut, Gedankenstrich nutzt, 'angeschlagen' verwendet, kürzer und idiomatischer ist.

2. **reply** — Deine Antwort als ${scenario.role} im Rollenspiel:
- Bleib STRENG in der Rolle. Du bist kein Lehrer hier, sondern die Person aus der Situation.
- KURZ HALTEN: maximal 15 Wörter, ideal 6-12. Wie echte Sprache: oft nur EINE einfache Frage oder EIN kurzer Satz + Frage. Keine langen Vorreden, keine ausführlichen Erklärungen, kein Setting-Aufbau.
- Einfacher Satzbau, klar und direkt. Stell eine konkrete Frage oder gib eine kurze Reaktion.
- Reagiere auf den INHALT (corrected version) der Lerner-Eingabe, nicht auf die Fehler.
- Treibe das Gespräch vorwärts mit einer einzigen, klaren Frage. Nicht mehrere Fragen auf einmal.
- Auch bei "hard" Schwierigkeit: KURZ. Komplexität liegt im Vokabular, nicht in der Länge.

Beispiele für gute reply-Werte (kurz, lebendig, mit klarer Frage):
- "Verstehe. Wann genau hat es angefangen?"
- "Schade. Haben Sie schon was probiert?"
- "Kein Problem. Möchten Sie es vor Ort essen?"
- "Aha. Und wie lange dauert das schon?"

Beispiele für SCHLECHTE reply-Werte (zu lang, zu erklärend):
- "Ich verstehe — seit gestern Abend, und nichts hat bisher angeschlagen. Darf ich fragen, was genau Sie spüren: eher Sodbrennen und Säure, oder eher ein Druckgefühl und Übelkeit?"  ← VIEL zu lang, mehrere Fragen, zu viel Setup.

Output: EIN JSON-Objekt, keine Codeblöcke, kein Markdown:
{
  "analysis": { ... },
  "reply": "deine Rollen-Antwort"
}`;
}

export function buildDialogReplyUserPrompt(
  scenario: Scenario,
  turns: DialogTurn[],
  newUserText: string
): string {
  const history = serializeTurns(turns, scenario.role);
  return `Bisheriger Dialog (Rolle: ${scenario.role}):
${history}

Neue Eingabe vom Lerner: "${newUserText}"

Antworte mit dem JSON-Objekt: { analysis, reply }.`;
}

// ── Fehlerbericht: AI deep-dive on top errors ────────────────────────────────

export function buildFehlerberichtPrompt(rules: string[]): string {
  const rulesList = rules
    .slice(0, 5)
    .map((r, i) => `${i + 1}. ${r}`)
    .join("\n");

  return `Du bist ein deutscher Sprachlehrer. Ein Lerner hat folgende wiederkehrende Fehler:

${rulesList}

Erstelle für JEDEN dieser Punkte einen kurzen, konkreten Lerntipp. WICHTIG: KEINE doppelten Anführungszeichen innerhalb der Strings, das zerstört JSON. Nutze stattdessen **Fettschrift** zur Hervorhebung.

Antworte mit EINEM gültigen JSON-Objekt, kein Markdown, keine Codeblöcke:

{
  "items": [
    {
      "title": "kurze Überschrift (max 6 Wörter, mit **Fettschrift** auf Schlüsselbegriff)",
      "explanation": "1-2 Sätze auf Deutsch, was die Regel ist und WARUM. Mit **Fettschrift**.",
      "examples": ["Beispielsatz 1", "Beispielsatz 2", "Beispielsatz 3"],
      "tip": "ein praktischer Merksatz oder Eselsbrücke auf Deutsch (max 15 Wörter)"
    }
  ]
}

Halte alles knapp und konkret. Beispiele MÜSSEN echte deutsche Sätze sein, die ein Lerner sich merken kann. Keine doppelten Anführungszeichen in Beispielen — wenn nötig, schreibe direkte Rede mit ‹...›.`;
}
