import Note from "../models/notes.model.js";
import UserModel from "../models/user.model.js";

const toClientShape = (doc) => {
    const content = doc.content && typeof doc.content === "object" ? doc.content : {};
    return {
        _id: doc._id,
        topic: doc.topic,
        prompt: doc.prompt || doc.topic || "",
        classLevel: doc.classLevel,
        examType: doc.examType,
        importance: content.importance || "",
        notes: typeof doc.content === "string" ? doc.content : content.notes || "",
        subTopics: content.subTopics || {},
        revisionPoints: content.revisionPoints || [],
        questions: content.questions || { short: [], long: [], diagram: "" },
        diagram: content.diagram || { type: "", data: "" },
        charts: content.charts || [],
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
};

export const getHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const docs = await Note.find({ user: userId }).sort({ createdAt: -1 });

        const notes = docs.map(toClientShape);

        return res.status(200).json({ success: true, notes });
    } catch (error) {
        return res.status(500).json({ message: `getHistory error ${error.message}` });
    }
};

export const updateHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, content } = req.body;

        const update = {};
        if (title && typeof title === "string" && title.trim()) {
            update.topic = title.trim();
        }
        if (content && typeof content === "object" && !Array.isArray(content)) {
            update.content = content;
        }

        if (!update.topic && !update.content) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const note = await Note.findOneAndUpdate(
            { _id: id, user: userId },
            update,
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ success: true, note: toClientShape(note) });
    } catch (error) {
        return res.status(500).json({ message: `updateHistory error ${error.message}` });
    }
};

export const deleteHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const note = await Note.findOneAndDelete({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        const user = await UserModel.findById(userId);
        if (user) {
            user.notes = Array.isArray(user.notes)
                ? user.notes.filter((nId) => nId.toString() !== note._id.toString())
                : [];
            await user.save();
        }

        return res.status(200).json({ success: true, message: "Note deleted" });
    } catch (error) {
        return res.status(500).json({ message: `deleteHistory error ${error.message}` });
    }
};