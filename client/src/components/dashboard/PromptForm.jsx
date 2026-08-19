// src/components/dashboard/PromptForm.jsx
import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  BarChart3,
  FileText,
  Globe,
  Layers,
  Sparkles,
  Type,
} from "lucide-react";

const NOTE_TYPES = ["General Notes", "Exam Notes", "Study Notes", "Project Notes"];
const LENGTHS = [
  { value: "Concise", label: "Concise" },
  { value: "Standard", label: "Standard" },
  { value: "Detailed", label: "Detailed" },
];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German"];

const selectClass = `
  w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700
  outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
`;

const PromptForm = ({ generating, error, onGenerate, disabled, ref }) => {
  const [topic, setTopic] = useState("");
  const [noteType, setNoteType] = useState("Exam Notes");
  const [length, setLength] = useState("Standard");
  const [language, setLanguage] = useState("English");
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = () => {
    if (!topic.trim()) {
      setLocalError("Please enter a topic to generate notes.");
      return;
    }
    setLocalError("");

    onGenerate({
      topic: topic.trim(),
      classLevel: "",
      examType: noteType,
      revisionMode: length === "Concise",
      includeDiagram,
      includeChart,
      language,
      length,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileText size={19} />
        </span>
        <div>
          <h2 className="text-base font-bold text-gray-900">Create New Notes</h2>
          <p className="text-sm text-gray-500">Describe the topic and let AI do the rest.</p>
        </div>
      </div>

      <label className="sr-only" htmlFor="note-prompt">
        What would you like to create notes about?
      </label>
      <textarea
        id="note-prompt"
        ref={ref}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
        }}
        rows={4}
        placeholder="What would you like to create notes about?"
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-[15px] leading-relaxed text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      />

      {(localError || error) && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle size={15} className="shrink-0" />
          {localError || error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Layers size={13} className="text-indigo-500" /> Note Type
          </span>
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            className={selectClass}
          >
            {NOTE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Type size={13} className="text-indigo-500" /> Length
          </span>
          <select value={length} onChange={(e) => setLength(e.target.value)} className={selectClass}>
            {LENGTHS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Globe size={13} className="text-indigo-500" /> Language
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Toggle
            label="Include Diagram"
            checked={includeDiagram}
            onChange={() => setIncludeDiagram((cur) => !cur)}
          />
          <Toggle
            label="Include Charts"
            checked={includeChart}
            onChange={() => setIncludeChart((cur) => !cur)}
          />
        </div>

        <motion.button
          whileTap={!generating ? { scale: 0.98 } : undefined}
          onClick={handleSubmit}
          disabled={generating || disabled}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all ${
            generating || disabled
              ? "cursor-not-allowed bg-gray-300"
              : "bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm hover:shadow-md hover:brightness-105"
          }`}
        >
          {generating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Notes
            </>
          )}
        </motion.button>
      </div>

      {generating && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <BarChart3 size={13} />
            AI is crafting your notes — this may take a minute or two.
          </p>
        </div>
      )}
    </motion.div>
  );
};

const Toggle = ({ label, checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className="flex select-none items-center gap-2.5"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      <span className={`text-sm font-medium ${checked ? "text-indigo-700" : "text-gray-600"}`}>
        {label}
      </span>
    </button>
  );
};

export default PromptForm;