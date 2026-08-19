import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { generateNoteApi } from "../api/notes.js";

// Normalize the AI payload before handing it to Notes.jsx.
// The backend now returns a real object (result.data = { ... }), but older
// responses may still be a JSON *string*, so parse defensively.
const toNotesObject = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      const trimmed = value.trim();
      const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const candidate = fenced ? fenced[1] : trimmed;
      return JSON.parse(candidate);
    } catch {
      return { notes: value }; // plain-text fallback, still readable
    }
  }
  return value;
};


const TopicForm = ({setResult, setloading, loading, setError}) => {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [noteId, setNoteId] = useState(null);

const handleSubmit = async () => {
  // Validate that a topic was entered before hitting the API.
  if (!topic.trim()) {
    setError("Please enter the topic");
    return;
  }

  // Reset UI state for a fresh generation run.
  setError("");
  setloading(true);
  setIsGenerating(true);
  setResult(null);
  setProgress(0);
  setProgressText("Preparing your request...");

  try {
    // Dynamically resolve the auth token so the app keeps working no matter
    // which storage key the login flow used (token / accessToken / authToken).
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");

    // Payload that matches what the Express controller expects.
    const payload = {
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    };

    // Call the API helper. On success it resolves to:
    //   { data: <notes text>, noteId: <saved note id> }
    const result = await generateNoteApi(payload, token);

    // Backend sanity check — bail out early if we got nothing back.
    if (!result) {
      throw new Error("No result returned from server");
    }

    console.log("Generated Notes Response:", result);
    console.log("Generated Notes:", result.data);

    setProgress(100);
    setProgressText("Notes generated successfully!");

    // 1) Consume the generated notes content (server key: `data`).
    //    Normalized to an object so Notes.jsx never renders raw JSON.
    const content = toNotesObject(
      result.data ?? result.note?.content ?? result.note
    );
    setResult(content);

    // 2) Save the created note id for future lookups / redirects.
    const generatedNoteId = result.noteId ?? result.note?._id ?? null;
    setNoteId(generatedNoteId);
    console.log("Saved Note ID:", generatedNoteId);

  } catch (error) {
    // Errors from generateNoteApi already log the backend body; here we
    // surface the message in the UI so the user sees what went wrong.
    console.error("Generate Notes Error:", error);

    setError(
      error.message || "Failed to fetch notes from server"
    );

    setProgress(0);
    setProgressText("");

  } finally {
    setloading(false);
    setIsGenerating(false);
  }
};


  useEffect(() => {
    if (!isGenerating) return;

    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 8;

      if (value >= 90) {
        value = 90;
        setProgressText("Finalizing your notes...");
        clearInterval(interval);
      } else if (value >= 70) {
        setProgressText("AI is generating your notes...");
      } else if (value >= 40) {
        setProgressText("Sending request to AI...");
      } else if (value >= 20) {
        setProgressText("Building your notes prompt...");
      } else {
        setProgressText("Preparing your request...");
      }

      setProgress(Math.floor(value));
    }, 700);

    return () => clearInterval(interval);
  }, [isGenerating]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        rounded-3xl
        bg-white/85 backdrop-blur-xl
        border border-white/70
        shadow-[0_15px_40px_rgba(79,70,229,0.08)]
        p-5 sm:p-7 md:p-9
        space-y-6
        text-gray-800
      "
    >
      {/* Card heading */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          ✨ Create AI Notes
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter your topic and let AI build study-ready notes instantly.
        </p>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>📚</span> Topic
        </label>
        <input
          type="text"
          className="
            w-full px-4 py-3
            rounded-xl
            bg-white
            border border-gray-200
            placeholder-gray-400
            text-gray-800
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400/60
            focus:border-blue-400
            transition
            shadow-sm
          "
          placeholder="Enter Topic (e.g. Web Development)"
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
        />
      </div>

      {/* Class Level */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>🎓</span> Level
        </label>
        <input
          type="text"
          className="
            w-full px-4 py-3
            rounded-xl
            bg-white
            border border-gray-200
            placeholder-gray-400
            text-gray-800
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400/60
            focus:border-blue-400
            transition
            shadow-sm
          "
          placeholder="Level (e.g. Class 10)"
          onChange={(e) => setClassLevel(e.target.value)}
          value={classLevel}
        />
      </div>

      {/* Exam Type */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>📝</span> Exam Type
        </label>
        <input
          type="text"
          className="
            w-full px-4 py-3
            rounded-xl
            bg-white
            border border-gray-200
            placeholder-gray-400
            text-gray-800
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400/60
            focus:border-blue-400
            transition
            shadow-sm
          "
          placeholder="Exam Type (e.g. CBSE, JEE, NEET)"
          onChange={(e) => setExamType(e.target.value)}
          value={examType}
        />
      </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Toggle label="Revision Mode" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />

          <Toggle label="Include Diagram" checked={includeDiagram} onChange={() => setIncludeDiagram(!includeDiagram)} />

          <Toggle label="Include Charts" checked={includeChart} onChange={() => setIncludeChart(!includeChart)} />

        </div>

        <motion.button
        onClick={handleSubmit}
          whileHover={!loading ? {scale: 1.02}:{}} 
          whileTap={!loading ? {scale: 0.96}: {}}
          disabled={loading}
        className={`
          w-full py-3.5 rounded-xl
          font-semibold text-base
          flex items-center justify-center gap-3 transition-all duration-300
          ${
            loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:shadow-[0_18px_40px_rgba(124,58,237,0.45)]"
          }`}>

            {loading ? (
              <>
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Generating Notes...
              </>
            ) : (
              <>
                <span>🚀</span>
                Generate Notes
              </>
            )}

        </motion.button>

       {(isGenerating || progress === 100) && 
       <div className="mt-2 space-y-2">

        <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
          initial={{width: 0}}
          animate={{ width: `${progress}%` }}
          transition={{ease: "easeInOut", duration:0.6}}
           className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">

          </motion.div>



        </div>

        <div className="flex justify-between text-xs text-gray-600 font-medium">
          <span>{progressText}</span>
          <span>{progress}%</span>

        </div>

        {progress !== 100 && (
          <p className="text-xs text-gray-400 text-center">
            This may take up to 2-5 min. Please don't close or refresh the page.
          </p>
        )}

        {progress === 100 && (
          <div className="flex justify-between text-xs text-emerald-600 font-medium">
            <span>✅ Note saved</span>
            <span>Note ID: {noteId || "-"}</span>
          </div>
        )}

        </div>}

    </motion.div>
  );
};


function Toggle({label,checked,onChange}){
  return(
    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onChange}>
      <motion.div
        animate={{
          backgroundColor: checked
          ?"rgba(79,70,229,0.9)"
          : "rgba(203,213,225,0.7)"
        }}
        transition={{duration: 0.25}}
        className="relative w-12 h-6 rounded-full
        border border-gray-200
        shadow-inner"
        >

          <motion.div
          layout 
          transition={{type: "spring", stiffness: 500, damping: 30}}
          className="absolute top-0.5
          h-5 w-5 rounded-full
          bg-white
          shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
          style={{
            left: checked ? "1.6rem" : "0.25rem",
          }}
          

          >

       
          </motion.div>
             

      </motion.div>
       <span
            className={`text-sm font-medium transition-colors ${
            checked ? "text-purple-700" : "text-gray-600"
            }`}
            >
          {label}
          </span>

    </div>
  )
}

export default TopicForm;

