// src/utils/notes.js
//
// Shared helpers used by the dashboard, sidebar and history views so every
// part of the app normalizes AI output / history records the same way.

export const DEFAULT_NOTES = {
  subTopics: {},
  importance: "",
  notes: "",
  revisionPoints: [],
  questions: { short: [], long: [], diagram: "" },
  diagram: { type: "", data: "" },
  charts: [],
};

export const getAuthToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("authToken");

// Turns any value returned by the generate endpoint into a notes object.
// Handles: object (new backend), JSON string (old backend / cached notes),
// fenced JSON (```json ... ```), and plain-text fallback.
export const normalizeResult = (raw) => {
  if (!raw) return null;

  let data = raw;

  if (typeof raw === "string") {
    try {
      const trimmed = raw.trim();
      const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const candidate = fenced ? fenced[1] : trimmed;
      data = JSON.parse(candidate);
    } catch {
      data = { notes: raw };
    }
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }

  return {
    ...DEFAULT_NOTES,
    ...data,
    subTopics: data.subTopics && typeof data.subTopics === "object" ? data.subTopics : {},
    revisionPoints: Array.isArray(data.revisionPoints) ? data.revisionPoints : [],
    questions: {
      ...DEFAULT_NOTES.questions,
      ...(data.questions && typeof data.questions === "object" ? data.questions : {}),
    },
    diagram: {
      ...DEFAULT_NOTES.diagram,
      ...(data.diagram && typeof data.diagram === "object" ? data.diagram : {}),
    },
    charts: Array.isArray(data.charts) ? data.charts : [],
  };
};

// Normalizes a history record (flat API shape, or a doc whose structured
// notes live under `content`) into the shape consumed by the note editor.
export const normalizeHistoryNote = (raw) => {
  if (!raw) return null;

  const source =
    raw.content && typeof raw.content === "object" && !Array.isArray(raw.content)
      ? { ...raw, ...raw.content }
      : { ...raw };

  return {
    ...DEFAULT_NOTES,
    ...source,
    subTopics:
      source.subTopics && typeof source.subTopics === "object" ? source.subTopics : {},
    revisionPoints: Array.isArray(source.revisionPoints) ? source.revisionPoints : [],
    questions: {
      ...DEFAULT_NOTES.questions,
      ...(source.questions && typeof source.questions === "object" ? source.questions : {}),
    },
    diagram: {
      ...DEFAULT_NOTES.diagram,
      ...(source.diagram && typeof source.diagram === "object" ? source.diagram : {}),
    },
    charts: Array.isArray(source.charts) ? source.charts : [],
    _id: raw._id,
    topic: raw.topic || raw.title || "Untitled",
    prompt: raw.prompt || raw.topic || "",
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

export const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const formatDateTime = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const makePreview = (text) => {
  if (!text) return "No preview available.";
  const cleaned = String(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*`>_\-[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 120 ? `${cleaned.slice(0, 120)}...` : cleaned;
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

// Extract a clean markdown string from a notes object for Copy/Download.
export const notesToMarkdown = (note) => {
  const parts = [];

  if (note?.notes) parts.push(note.notes.trim());
  if (note?.importance) {
    parts.push(`\n**Importance:** ${note.importance}`);
  }

  if (note?.revisionPoints?.length) {
    parts.push("\n## Revision Points\n" + note.revisionPoints.map((p) => `- ${p}`).join("\n"));
  }

  if (note?.questions?.short?.length) {
    parts.push(
      "\n## Short Questions\n" + note.questions.short.map((q, i) => `${i + 1}. ${q}`).join("\n")
    );
  }

  if (note?.questions?.long?.length) {
    parts.push(
      "\n## Long Questions\n" + note.questions.long.map((q, i) => `${i + 1}. ${q}`).join("\n")
    );
  }

  if (note?.diagram?.data) parts.push(`\n## Diagram\n\`\`\`mermaid\n${note.diagram.data}\n\`\`\``);

  return parts.join("\n\n");
};
