// controllers/generate.controller.js
import Notes from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGroqResponse } from "../services/groq.services.js";
import { parseAiJson } from "../utils/parseAiJson.js";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false
    } = req.body;

    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User is not found" });

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart
    });

    // Call Groq service. generateGroqResponse returns a plain text string
    // (the model writes JSON as text, possibly wrapped in ```json fences).
    const aiResponse = await generateGroqResponse(prompt);

    // ROOT-CAUSE FIX: convert the AI text into a real JavaScript object here.
    // Previously the raw string was stored and returned, and the frontend
    // rendered the JSON-as-text instead of human-readable notes.
    const parsedNotes = parseAiJson(aiResponse);

    // Save note with metadata (content is stored as a structured object).
    const noteDoc = await Notes.create({
      user: user._id,
      topic,
      prompt: topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: parsedNotes
    });

    // Track the note in the user's history and save.
    user.notes = Array.isArray(user.notes) ? user.notes : [];
    user.notes.push(noteDoc._id);
    await user.save();

    // Return the parsed structured object, not a JSON-stringified JSON object.
    return res.status(200).json({
      data: parsedNotes,
      noteId: noteDoc._id
    });

  } catch (error) {
    console.error("generateNotes error:", error?.message || error);
    const message = error?.message || "AI generation failed";
    // 502 = the AI output could not be turned into valid notes JSON.
    const isAiParseError = /AI returned|AI response|empty response/.test(message);
    return res.status(isAiParseError ? 502 : 500).json({ error: "AI generation failed", message });
  }
};
