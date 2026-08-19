import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ensure this matches your user model's name
    required: true,
    index: true
  },
  topic: { type: String, required: true, trim: true },
  prompt: { type: String, trim: true },
  classLevel: { type: String, trim: true },
  examType: { type: String, trim: true },
  revisionMode: { type: Boolean, default: false },
  includeDiagram: { type: Boolean, default: false },
  includeChart: { type: Boolean, default: false },
  content: { type: mongoose.Schema.Types.Mixed }, // structured notes object (from parseAiJson)
  model: { type: String },
  tokensUsed: { type: Number, default: 0 },
  meta: { type: mongoose.Schema.Types.Mixed } // raw SDK response
}, { timestamps: true });

export default mongoose.model("Note", notesSchema);