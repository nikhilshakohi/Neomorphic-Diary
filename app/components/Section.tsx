import { useEffect, useState } from "react";
import Greetings from "./Greetings";
import "./../styles/section.css";
import Inputs from "./Inputs";
import Entry from "./Entry";
import { useDiaryEntries } from "../hooks/useDiaryEnries";
import ConfirmModal from "../modals/ConfirmModal";
import EditModal from "../modals/EditModal";

const LOADING_TEXT = "Bringing memories back ✨";

const EmptyState = () => (
  <p className="mt-6 text-center opacity-60">
    No entries yet. Start writing ✍️🙂
  </p>
);

export default function Section() {
  const {
    entries,
    loading,
    hasMore,
    loadMore,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useDiaryEntries();
  const [typed, setTyped] = useState("");
  const [editingEntry, setEditingEntry] = useState<null | {
    id: string;
    title: string;
    date: string;
    content: string;
  }>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;

    let i = 0;
    const id = setInterval(() => {
      setTyped(LOADING_TEXT.slice(0, (i += 2)));
      if (i >= LOADING_TEXT.length) clearInterval(id);
    }, 50);

    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="section">
      <div className="flex justify-between px-1.5">
        <Greetings />
        <div className="flex items-center gap-2 text-sm">
          <button>🗓️</button>
          <button>🔎</button>
        </div>
      </div>

      <Inputs addEntry={addEntry} />

      {entries.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        entries.map(({ id, title, date, content }) => (
          <Entry
            id={id}
            key={id}
            title={title}
            date={date}
            content={content}
            onDelete={() => {
              setOpenMenuId(null);
              setConfirmDeleteId(id);
            }}
            onEdit={() => {
              setOpenMenuId(null);
              setEditingEntry({ id, title, date, content });
            }}
            menuOpen={openMenuId === id}
            onMenuToggle={() =>
              setOpenMenuId((prev) => (prev === id ? null : id))
            }
          />
        ))
      )}

      {hasMore && (
        <div className="text-center mt-6 flex justify-center gap-3">
          <button
            className="authButton"
            disabled={loading}
            onClick={() => loadMore({})}
          >
            {loading ? typed : "Load more ⬇️"}
          </button>

          {entries.length > 0 && (
            <button
              className="authButton"
              disabled={loading}
              onClick={() => loadMore({ all: true })}
            >
              Load all 📚
            </button>
          )}
        </div>
      )}
      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this entry?"
          onConfirm={async () => {
            await deleteEntry(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {editingEntry && (
        <EditModal
          entry={editingEntry}
          onSave={async (updated) => {
            await updateEntry(updated);
            setEditingEntry(null);
          }}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}
