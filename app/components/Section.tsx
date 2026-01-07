import { useState } from "react";
import Greetings from "./Greetings";
import "./../styles/section.css";
import Inputs from "./Inputs";
import { useDiaryEntries } from "../hooks/useDiaryEnries";
import ConfirmModal from "../modals/ConfirmModal";
import EditModal from "../modals/EditModal";
import EntryList from "./EntryList";
import SearchPanel from "./SearchPanel";
import ScrollToTopButton from "./ScrollToTopButton";
import { useTypewriter } from "../hooks/useTypewriter";
import OnThisDayPanel from "./OnThisDayPanel";
import StreakBadge from "./StreakBadge";

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

  const [editingEntry, setEditingEntry] = useState<null | {
    id: string;
    title: string;
    date: string;
    content: string;
  }>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [mode, setMode] = useState<"normal" | "search" | "onThisDay">("normal");
  const typed = useTypewriter(LOADING_TEXT, 40);
  const [searchPresetDate, setSearchPresetDate] = useState<string | null>(null);

  const ensureAllLoaded = async () => {
    if (hasMore) await loadMore({ all: true });
  };

  const toggleMode = (next: "onThisDay" | "search") => {
    setMode((prev) => (prev === next ? "normal" : next));
    ensureAllLoaded();
  };

  return (
    <div className="section">
      <div className="flex justify-between px-1.5">
        <Greetings />
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => toggleMode("onThisDay")}>🗓️</button>
          <button onClick={() => toggleMode("search")}>🔎</button>
        </div>
      </div>

      <Inputs addEntry={addEntry} />

      {mode === "normal" && (
        <StreakBadge
          onDateClick={(date) => {
            setSearchPresetDate(date);
            setMode("search");
            ensureAllLoaded();
          }}
        />
      )}

      {mode === "normal" &&
        (entries.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <EntryList
            entries={entries}
            onEdit={(entry) => setEditingEntry(entry)}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        ))}

      {mode === "search" && (
        <SearchPanel
          entries={entries}
          loading={loading}
          hasMore={hasMore}
          loadAll={ensureAllLoaded}
          presetDate={searchPresetDate}
          onClose={() => {
            setSearchPresetDate(null);
            setMode("normal");
          }}
        />
      )}

      {mode === "onThisDay" && (
        <OnThisDayPanel
          entries={entries}
          loading={loading}
          onClose={() => setMode("normal")}
        />
      )}

      <ScrollToTopButton />

      {mode === "normal" && hasMore && (
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
