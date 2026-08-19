// src/pages/Notes.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import PromptForm from "../components/dashboard/PromptForm.jsx";
import NoteEditor from "../components/dashboard/NoteEditor.jsx";
import { ConfirmDialog, Modal } from "../components/ui/Modal.jsx";
import { useToast } from "../components/ui/toastContext.js";
import {
  deleteHistoryApi,
  generateNoteApi,
  getHistoryApi,
  updateHistoryApi,
} from "../api/notes.js";
import { logoutApi } from "../api/auth.js";
import { setUserData } from "../redux/userSlice.js";
import {
  getAuthToken,
  getInitials,
  normalizeHistoryNote,
  normalizeResult,
  notesToMarkdown,
} from "../utils/notes.js";

const Notes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { userData } = useSelector((state) => state.user);

  const [notes, setNotes] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameBusy, setRenameBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const promptRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    getHistoryApi(getAuthToken())
      .then((data) => {
        if (cancelled) return;
        setNotes((data?.notes || []).map(normalizeHistoryNote).filter(Boolean));
      })
      .catch((e) => {
        if (cancelled) return;
        toast.error(e?.message || "Failed to load your notes");
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const openNote = useCallback(
    (note) => {
      setSidebarOpen(false);
      setEditing(false);
      setSelectedId(note._id);
      setCurrentNote(normalizeHistoryNote(note));
      setGenerateError("");
    },
    []
  );

  const newNote = useCallback(() => {
    setSidebarOpen(false);
    setEditing(false);
    setSelectedId(null);
    setCurrentNote(null);
    setGenerateError("");
    promptRef.current?.focus?.();
  }, []);

  const handleGenerate = async (payload) => {
    setGenerating(true);
    setGenerateError("");
    setCurrentNote(null);
    setSelectedId(null);
    setEditing(false);

    try {
      const result = await generateNoteApi(payload, getAuthToken());
      if (!result) throw new Error("No result returned from server");

      const content = normalizeResult(result.data ?? result.note?.content ?? result.note);
      if (!content) throw new Error("Could not read the generated notes");

      const now = new Date().toISOString();
      const id = result.noteId ?? result.note?._id ?? null;
      const item = {
        _id: id,
        topic: payload.topic,
        prompt: payload.topic,
        importance: content.importance,
        notes: content.notes,
        subTopics: content.subTopics,
        revisionPoints: content.revisionPoints,
        questions: content.questions,
        diagram: content.diagram,
        charts: content.charts,
        createdAt: now,
        updatedAt: now,
      };

      if (id) setNotes((prev) => [item, ...prev.filter((n) => n._id !== id)]);
      else setNotes((prev) => [item, ...prev]);

      setSelectedId(item._id);
      setCurrentNote(normalizeHistoryNote(item));
      toast.success("Notes generated and saved to your history");
    } catch (error) {
      console.error("Generate Notes Error:", error);
      setGenerateError(error.message || "Failed to fetch notes from server");
      toast.error(error.message || "Failed to generate notes");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!currentNote) return;
    const text = notesToMarkdown(currentNote);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Notes copied to clipboard");
    } catch {
      toast.error("Could not copy notes");
    }
  }, [currentNote, toast]);

  const handleDownload = useCallback(() => {
    if (!currentNote) return;
    const text = notesToMarkdown(currentNote);
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(currentNote.topic || "notes").replace(/[^\w\s-]/g, "").trim() || "notes"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded");
  }, [currentNote, toast]);

  const openRename = useCallback((note) => {
    setRenameTarget(note);
    setRenameTitle(note.topic || "");
  }, []);

  const closeRename = useCallback(() => {
    setRenameTarget(null);
    setRenameBusy(false);
  }, []);

  const handleRename = async () => {
    const title = renameTitle.trim();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    setRenameBusy(true);
    try {
      const res = await updateHistoryApi(renameTarget._id, { title }, getAuthToken());
      const updated = res?.note;
      setNotes((prev) =>
        prev.map((n) =>
          n._id === renameTarget._id
            ? { ...n, topic: title, updatedAt: updated?.updatedAt || n.updatedAt }
            : n
        )
      );
      if (selectedId === renameTarget._id) {
        setCurrentNote((cur) => (cur ? { ...cur, topic: title } : cur));
      }
      toast.success("Note renamed");
      closeRename();
    } catch (e) {
      toast.error(e.message || "Failed to rename note");
    } finally {
      setRenameBusy(false);
    }
  };

  const openDelete = useCallback((note) => setDeleteTarget(note), []);

  const closeDelete = useCallback(() => {
    setDeleteTarget(null);
    setDeleteBusy(false);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await deleteHistoryApi(deleteTarget._id, getAuthToken());
      setNotes((prev) => prev.filter((n) => n._id !== deleteTarget._id));
      if (selectedId === deleteTarget._id) {
        setSelectedId(null);
        setCurrentNote(null);
        setEditing(false);
      }
      toast.success("Note deleted");
      closeDelete();
    } catch (e) {
      toast.error(e.message || "Failed to delete note");
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleEdit = useCallback(() => setEditing(true), []);

  const handleSaveEdit = async (draft) => {
    if (!currentNote?._id) return;
    setSaving(true);
    try {
      const content = {
        notes: draft,
        importance: currentNote.importance,
        subTopics: currentNote.subTopics,
        revisionPoints: currentNote.revisionPoints,
        questions: currentNote.questions,
        diagram: currentNote.diagram,
        charts: currentNote.charts,
      };
      const res = await updateHistoryApi(currentNote._id, { content }, getAuthToken());
      const updated = res?.note;

      setNotes((prev) =>
        prev.map((n) =>
          n._id === currentNote._id
            ? {
                ...n,
                notes: draft,
                importance: currentNote.importance,
                subTopics: currentNote.subTopics,
                revisionPoints: currentNote.revisionPoints,
                questions: currentNote.questions,
                diagram: currentNote.diagram,
                charts: currentNote.charts,
                updatedAt: updated?.updatedAt || n.updatedAt,
              }
            : n
        )
      );
      setCurrentNote((cur) =>
        cur ? { ...cur, notes: draft, updatedAt: updated?.updatedAt || cur.updatedAt } : cur
      );
      setEditing(false);
      toast.success("Changes saved");
    } catch (e) {
      toast.error(e.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // continue with local logout even if the network call fails
    }
    dispatch(setUserData(null));
    navigate("/auth");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={openNote}
        onNewNote={newNote}
        onRename={openRename}
        onDelete={openDelete}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((cur) => !cur)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-gray-900">
                AI Notes Generator
              </h1>
              <p className="hidden truncate text-xs text-gray-500 sm:block">
                Turn your ideas into organized notes with AI.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden text-right sm:block">
              <span className="block max-w-[160px] truncate text-sm font-semibold text-gray-800">
                {userData?.name}
              </span>
              <span className="block text-xs text-gray-400">{userData?.credits ?? 0} credits</span>
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white"
              title={userData?.name}
            >
              {getInitials(userData?.name)}
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <PromptForm
              ref={promptRef}
              generating={generating}
              error={generateError}
              onGenerate={handleGenerate}
            />

            <div className="min-h-[240px]">
              {historyLoading && notes.length === 0 ? (
                <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                </div>
              ) : generating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-white/60 text-center"
                >
                  <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
                  <p className="mt-4 text-sm font-medium text-gray-600">Generating your notes...</p>
                  <p className="mt-1 text-xs text-gray-400">
                    This may take a minute or two. Hang tight!
                  </p>
                </motion.div>
              ) : currentNote ? (
                <NoteEditor
                  note={currentNote}
                  editing={editing}
                  saving={saving}
                  onEdit={handleEdit}
                  onCancelEdit={() => setEditing(false)}
                  onSave={handleSaveEdit}
                  onCopy={handleCopy}
                  onDelete={() => openDelete(currentNote)}
                  onDownload={handleDownload}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/60 text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                    <Sparkles size={22} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-gray-700">No note selected</p>
                  <p className="mt-1 max-w-xs text-xs text-gray-400">
                    Generate new notes above, or pick an existing note from your history in the
                    sidebar.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Rename dialog */}
      <Modal
        open={!!renameTarget}
        onClose={closeRename}
        title="Rename note"
        className="max-w-sm"
      >
        <label htmlFor="rename-input" className="mb-1.5 block text-xs font-semibold text-gray-600">
          Title
        </label>
        <input
          id="rename-input"
          type="text"
          value={renameTitle}
          onChange={(e) => setRenameTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
          }}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter a new title"
          autoFocus
        />
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={closeRename}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            disabled={renameBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {renameBusy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            Rename
          </button>
        </div>
      </Modal>

      {/* Delete dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Delete note"
        message={`Are you sure you want to delete "${deleteTarget?.topic || "this note"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteBusy}
      />
    </div>
  );
};

export default Notes;