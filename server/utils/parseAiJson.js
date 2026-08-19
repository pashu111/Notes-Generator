// utils/parseAiJson.js
//
// Parses the raw text returned by the AI model into a structured notes object.
// The model is instructed to return ONLY valid JSON, but in practice it can
// wrap the JSON in ```json code fences or add stray text, so we defensively
// strip those before calling JSON.parse().

const DEFAULT_NOTES = {
  subTopics: { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] },
  importance: "⭐",
  notes: "",
  revisionPoints: [],
  questions: { short: [], long: [], diagram: "" },
  diagram: { type: "", data: "" },
  charts: [],
};

/**
 * Extract a JSON object from a possibly-fenced / noisy AI response.
 *
 * @param {string} raw - Raw string returned by Groq.
 * @returns {object} Parsed, schema-normalized notes object.
 * @throws {Error} With a descriptive message when parsing fails.
 */
export const parseAiJson = (raw) => {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    throw new Error("AI returned an empty response. Please try again.");
  }

  let cleaned = raw.trim();

  // 1) Strip ```json ... ``` (and bare ``` ... ```) code fences.
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    cleaned = fenced[1].trim();
  }

  // 2) If stray text still surrounds the object, keep only the JSON.
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // 3) Parse. Try the cleaned string first, then the raw string as fallback.
  let parsed = null;
  for (const candidate of [cleaned, raw.trim()]) {
    try {
      parsed = JSON.parse(candidate);
      break;
    } catch {
      /* keep trying */
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      "AI returned invalid JSON. Please try generating your notes again."
    );
  }

  // 4) Normalize to the expected schema with safe defaults.
  const notes = {
    ...DEFAULT_NOTES,
    ...parsed,
    subTopics: {
      ...DEFAULT_NOTES.subTopics,
      ...(parsed.subTopics && typeof parsed.subTopics === "object"
        ? parsed.subTopics
        : {}),
    },
    revisionPoints: Array.isArray(parsed.revisionPoints)
      ? parsed.revisionPoints
      : [],
    questions: {
      ...DEFAULT_NOTES.questions,
      ...(parsed.questions && typeof parsed.questions === "object"
        ? parsed.questions
        : {}),
    },
    diagram: {
      ...DEFAULT_NOTES.diagram,
      ...(parsed.diagram && typeof parsed.diagram === "object"
        ? parsed.diagram
        : {}),
    },
    charts: Array.isArray(parsed.charts) ? parsed.charts : [],
  };

  notes.questions.short = Array.isArray(notes.questions.short)
    ? notes.questions.short
    : [];
  notes.questions.long = Array.isArray(notes.questions.long)
    ? notes.questions.long
    : [];

  if (!notes.notes || typeof notes.notes !== "string") {
    throw new Error("AI response is missing the notes content. Please try again.");
  }

  return notes;
};

export default parseAiJson;