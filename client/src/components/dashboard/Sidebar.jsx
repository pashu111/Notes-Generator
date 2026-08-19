// src/components/dashboard/Sidebar.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatDateTime, getInitials, makePreview } from "../../utils/notes.js";
import { useToast } from "../ui/toastContext.js";

const Sidebar = ({
  notes,
  selectedId,
  onSelect,
  onNewNote,
  onRename,
  onDelete,
  open,
  onClose,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { userData } = useSelector((state) => state.user);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? notes.filter(
        (n) =>
          (n.topic || "").toLowerCase().includes(query) ||
          (n.prompt || "").toLowerCase().includes(query)
      )
    : notes;

  const handleMenuAction = (note, action) => {
    setOpenMenuId(null);
    if (action === "rename") onRename(note);
    if (action === "delete") onDelete(note);
  };

  const content = (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <button
          onClick={() => {
            setShowProfile(false);
            onNewNote();
          }}
          className="flex min-w-0 items-center gap-2.5"
          title="AI Notes"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
            <Sparkles size={18} />
          </span>
          {!collapsed && (
            <span className="truncate text-[15px] font-bold tracking-tight text-gray-900">
              AI Notes
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* New note + search */}
      <div className="shrink-0 space-y-3 px-4 pt-4">
        <button
          onClick={() => {
            setShowProfile(false);
            onNewNote();
          }}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 ${
            collapsed ? "!px-0" : ""
          }`}
          title="New Note"
        >
          <Plus size={16} />
          {!collapsed && "New Note"}
        </button>

        {!collapsed && (
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}
      </div>

      {/* History list */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {!collapsed && (
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Recent Notes
            </span>
            {filtered.length > 0 && (
              <span className="text-xs font-medium text-gray-400">{filtered.length}</span>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <FileText size={18} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs text-gray-400">
                {query ? "No notes match your search." : "No notes yet. Generate your first note!"}
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((note) => (
                <HistoryItem
                  key={note._id}
                  note={note}
                  active={note._id === selectedId}
                  collapsed={collapsed}
                  menuOpen={openMenuId === note._id}
                  onToggleMenu={() =>
                    setOpenMenuId((cur) => (cur === note._id ? null : note._id))
                  }
                  onSelect={() => {
                    setShowProfile(false);
                    onSelect(note);
                  }}
                  onRename={() => handleMenuAction(note, "rename")}
                  onDelete={() => handleMenuAction(note, "delete")}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom options */}
      <div className="shrink-0 border-t border-gray-100 p-2">
        {openMenuId && (
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
        )}

        <div className="relative space-y-0.5">
          {!collapsed && userData && (
            <div className="px-3 pb-2">
              <p className="truncate text-sm font-semibold text-gray-800">{userData.name}</p>
              <p className="truncate text-xs text-gray-400">{userData.email}</p>
            </div>
          )}

          <div className="relative">
            <SidebarAction
              icon={User}
              label="Profile"
              collapsed={collapsed}
              active={showProfile}
              onClick={() => setShowProfile((cur) => !cur)}
            />
            <AnimatePresence>
              {showProfile && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-2 right-2 mb-1 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {getInitials(userData?.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {userData?.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-xs font-medium text-gray-500">Credits</span>
                    <span className="text-sm font-bold text-gray-800">
                      {userData?.credits ?? 0}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SidebarAction
            icon={LogOut}
            label="Logout"
            collapsed={collapsed}
            danger
            onClick={onLogout}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden h-full shrink-0 border-r border-gray-200 transition-all duration-300 lg:block ${
          collapsed ? "w-[72px]" : "w-72"
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarAction = ({ icon: Icon, label, collapsed, danger, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        collapsed ? "justify-center !px-0" : ""
      } ${
        danger
          ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
          : active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
};

const HistoryItem = ({
  note,
  active,
  collapsed,
  menuOpen,
  onToggleMenu,
  onSelect,
  onRename,
  onDelete,
}) => {
  if (collapsed) {
    return (
      <li>
        <button
          onClick={onSelect}
          title={note.topic}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
            active
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {(note.topic || "N")[0].toUpperCase()}
        </button>
      </li>
    );
  }

  return (
    <li className="relative">
      <div
        onClick={onSelect}
        className={`group cursor-pointer rounded-xl border px-3 py-2.5 transition-all ${
          active
            ? "border-indigo-100 bg-indigo-50/70"
            : "border-transparent hover:border-gray-100 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-sm font-semibold ${
                active ? "text-indigo-700" : "text-gray-800"
              }`}
            >
              {note.topic || "Untitled"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
              {makePreview(note.notes)}
            </p>
            <p className="mt-1.5 text-[11px] text-gray-400">
              {formatDateTime(note.updatedAt || note.createdAt)}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            aria-label={`Options for ${note.topic}`}
            className={`shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-white hover:text-gray-600 ${
              menuOpen ? "bg-white text-gray-600 shadow-sm" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-3 top-10 z-20 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          <button
            onClick={onRename}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil size={14} className="text-gray-400" />
            Rename
          </button>
          <button
            onClick={onDelete}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default Sidebar;