import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar.jsx';
import MermaidDiagram from '../components/MermaidDiagram.jsx';
import GeneratedChart from '../components/GeneratedChart.jsx';
import { getHistoryApi, deleteHistoryApi } from '../api/notes.js';

const DEFAULT_NOTES = {
  subTopics: {},
  importance: "",
  notes: "",
  revisionPoints: [],
  questions: { short: [], long: [], diagram: "" },
  diagram: { type: "", data: "" },
  charts: [],
};

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("authToken");

// Normalizes a history record (flat API shape, or a doc whose structured
// notes live under `content`) into the same shape Notes.jsx consumes.
const normalizeNote = (raw) => {
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
    topic: raw.topic || "Untitled",
    createdAt: raw.createdAt,
  };
};

const formatDate = (value) => {
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

const makePreview = (text) => {
  if (!text) return "No notes preview available.";
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*`>_\-[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 140 ? `${cleaned.slice(0, 140)}...` : cleaned;
};

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getHistoryApi(getToken())
      .then((data) => {
        if (cancelled) return;
        setNotes((data?.notes || []).map(normalizeNote).filter(Boolean));
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "Failed to load history");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    setError("");
    try {
      await deleteHistoryApi(id, getToken());
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (e) {
      setError(e?.message || "Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              📚 Your Notes
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              All your previously generated notes, saved automatically.
            </p>
          </div>

          {!selected && notes.length > 0 && (
            <button
              onClick={() => navigate("/notes")}
              className="px-5 py-2.5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
            >
              ✨ Generate New Notes
            </button>
          )}
        </motion.div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {selected ? (
          <NoteDetail
            note={selected}
            onBack={() => setSelected(null)}
            onDelete={() => handleDelete(selected._id)}
          />
        ) : (
          <>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-52 rounded-2xl bg-white/70 border border-gray-200 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && notes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-white/70 border border-gray-200 shadow-sm p-10 flex flex-col items-center justify-center text-center"
              >
                <span className="text-5xl mb-4">🗒️</span>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  No notes yet
                </h2>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Generate your first set of AI notes and they will be saved here
                  automatically.
                </p>
                <button
                  onClick={() => navigate("/notes")}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
                >
                  ✨ Generate Notes
                </button>
              </motion.div>
            )}

            {!loading && notes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-800 leading-snug">
                        📚 {note.topic}
                      </h3>

                      <button
                        onClick={() => handleDelete(note._id)}
                        title="Delete note"
                        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        🗑️
                      </button>
                    </div>

                    {note.importance && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium w-fit">
                        <span>⭐</span>
                        <span>{note.importance}</span>
                      </div>
                    )}

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {makePreview(note.notes)}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        📅 {formatDate(note.createdAt)}
                      </span>

                      <button
                        onClick={() => setSelected(note)}
                        className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-sm hover:opacity-90 transition"
                      >
                        View Notes →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NoteDetail = ({ note, onBack, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-gray-200 shadow-xl p-6 md:p-10"
    >
      <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            📚 {note.topic}
          </h2>

          {note.importance && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
              <span>Importance:</span>
              <span className="font-bold">{note.importance}</span>
            </div>
          )}

          <p className="mt-2 text-xs text-gray-400">
            📅 {formatDate(note.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold shadow-sm hover:bg-gray-50 transition"
          >
            ← Back to History
          </button>

          <button
            onClick={onDelete}
            className="px-5 py-2.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Main Notes */}
      <section className="mb-10">
        <div className="prose prose-lg prose-slate max-w-none
          prose-headings:font-bold
          prose-h2:text-blue-700
          prose-h3:text-purple-700
          prose-h4:text-indigo-600
          prose-strong:text-gray-900
          prose-a:text-blue-600
          prose-blockquote:border-l-purple-400 prose-blockquote:bg-purple-50/50 prose-blockquote:text-gray-600
          prose-code:bg-blue-50 prose-code:text-blue-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal
          prose-pre:bg-slate-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:text-gray-800
          prose-table:border prose-table:border-gray-200
          prose-th:bg-blue-50 prose-th:border prose-th:border-gray-200 prose-th:text-gray-800
          prose-td:border prose-td:border-gray-200
          prose-tr:odd:bg-white prose-tr:even:bg-blue-50/40
          prose-li:marker:text-purple-500">
          <ReactMarkdown>
            {note.notes || ""}
          </ReactMarkdown>
        </div>
      </section>

      {/* Sub Topics */}
      {note.subTopics &&
        Object.keys(note.subTopics).length > 0 && (
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📌 Important Topics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(note.subTopics).map(([level, topics], cardIndex) => (
                <div
                  key={level}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    cardIndex % 3 === 0
                      ? "bg-blue-50 border-blue-100"
                      : cardIndex % 3 === 1
                      ? "bg-purple-50 border-purple-100"
                      : "bg-pink-50 border-pink-100"
                  }`}
                >
                  <h4 className="text-lg font-bold mb-3 text-gray-800">{level}</h4>
                  <ul className="space-y-2">
                    {topics.map((topic, index) => (
                      <li key={index} className="text-gray-700 flex gap-2">
                        <span className="text-purple-500">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* Revision Points */}
      {note.revisionPoints?.length > 0 && (
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔄 Revision Points
          </h3>

          <div className="space-y-3">
            {note.revisionPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Short Questions */}
      {note.questions?.short?.length > 0 && (
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ❓ Short Questions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {note.questions.short.map((question, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  Q{index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{question}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Long Questions */}
      {note.questions?.long?.length > 0 && (
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📝 Long Questions
          </h3>

          <div className="space-y-4">
            {note.questions.long.map((question, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl bg-gradient-to-r from-white to-blue-50/60 border border-blue-100 p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white text-sm font-bold">
                  Q{index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{question}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diagram */}
      {note.diagram?.data && (
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Diagram
          </h3>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6">
            <MermaidDiagram chart={note.diagram.data} />
          </div>
        </section>
      )}

      {/* Charts */}
      {note.charts?.length > 0 && (
        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📈 Charts
          </h3>

          <div className="space-y-6">
            {note.charts.map((chart, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-6"
              >
                <GeneratedChart chart={chart} />
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default History;