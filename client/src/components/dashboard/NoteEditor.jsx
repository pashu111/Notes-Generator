// src/components/dashboard/NoteEditor.jsx
import { useRef } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Download,
  FileText,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import MermaidDiagram from "../MermaidDiagram.jsx";
import GeneratedChart from "../GeneratedChart.jsx";
import { formatDateTime } from "../../utils/notes.js";

const NoteEditor = ({
  note,
  editing,
  saving,
  onEdit,
  onCancelEdit,
  onSave,
  onCopy,
  onDelete,
  onDownload,
}) => {
  const draftRef = useRef(null);

  if (!note) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileText size={16} className="shrink-0 text-indigo-500" />
            <h2 className="truncate text-base font-bold text-gray-900">{note.topic}</h2>
          </div>
          {note.prompt && note.prompt !== note.topic && (
            <p className="mt-0.5 truncate text-xs text-gray-400">“{note.prompt}”</p>
          )}
          <p className="mt-1 text-[11px] text-gray-400">
            {formatDateTime(note.updatedAt || note.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={() => onSave(draftRef.current?.value || "")}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Save size={13} />
                )}
                Save
              </button>
            </>
          ) : (
            <>
              <ActionButton icon={Copy} label="Copy" onClick={onCopy} />
              <ActionButton icon={Pencil} label="Edit" onClick={onEdit} />
              <ActionButton icon={Download} label="Download" onClick={onDownload} />
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-6 sm:px-8">
        {editing ? (
          <div>
            <label className="sr-only" htmlFor="note-edit">
              Edit note content
            </label>
            <textarea
              id="note-edit"
              ref={draftRef}
              defaultValue={note?.notes || ""}
              rows={22}
              className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-mono text-sm leading-relaxed text-gray-800 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-2 text-xs text-gray-400">
              Supports Markdown. Your changes are saved to this note.
            </p>
          </div>
        ) : (
          <div>
            {note.importance && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <span>Importance:</span>
                <span>{note.importance}</span>
              </div>
            )}

            {/* Main notes */}
            {note.notes && (
              <div className="prose prose-sm prose-slate max-w-none sm:prose-base
                prose-headings:font-bold
                prose-h2:text-gray-900
                prose-h3:text-gray-800
                prose-strong:text-gray-900
                prose-a:text-indigo-600
                prose-blockquote:border-l-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:text-gray-600
                prose-code:bg-indigo-50 prose-code:text-indigo-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal
                prose-pre:bg-slate-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                prose-table:border prose-table:border-gray-200
                prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:text-gray-800
                prose-td:border prose-td:border-gray-200
                prose-tr:odd:bg-white prose-tr:even:bg-gray-50/40
                prose-li:marker:text-indigo-500">
                <ReactMarkdown>{note.notes}</ReactMarkdown>
              </div>
            )}

            {/* Sub topics */}
            {note.subTopics && Object.keys(note.subTopics).length > 0 && (
              <Section title="Important Topics">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(note.subTopics).map(([level, topics]) => (
                    <div
                      key={level}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                    >
                      <h4 className="mb-2 text-sm font-bold text-gray-800">{level}</h4>
                      <ul className="space-y-1.5">
                        {topics.map((topic, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-600">
                            <span className="text-indigo-400">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Revision points */}
            {note.revisionPoints?.length > 0 && (
              <Section title="Revision Points">
                <div className="space-y-2">
                  {note.revisionPoints.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Short questions */}
            {note.questions?.short?.length > 0 && (
              <Section title="Short Questions">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {note.questions.short.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
                        Q{i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700">{q}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Long questions */}
            {note.questions?.long?.length > 0 && (
              <Section title="Long Questions">
                <div className="space-y-3">
                  {note.questions.long.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-indigo-50 bg-indigo-50/30 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                        Q{i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700">{q}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Diagram */}
            {note.diagram?.data && (
              <Section title="Diagram">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                  <MermaidDiagram chart={note.diagram.data} />
                </div>
              </Section>
            )}

            {/* Charts */}
            {note.charts?.length > 0 && (
              <Section title="Charts">
                <div className="space-y-5">
                  {note.charts.map((chart, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-violet-100 bg-violet-50/30 p-4"
                    >
                      <GeneratedChart chart={chart} />
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Section = ({ title, children }) => (
  <section className="mt-8">
    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
      {title}
    </h3>
    {children}
  </section>
);

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
  >
    <Icon size={13} /> {label}
  </button>
);

export default NoteEditor;