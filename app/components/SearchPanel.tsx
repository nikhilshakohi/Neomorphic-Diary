import { useEffect, useState } from "react";
import EntryList from "./EntryList";
import { DiaryEntry } from "../hooks/useDiaryEnries";
import { useTypewriter } from "../hooks/useTypewriter";

type Props = {
  entries: DiaryEntry[];
  loading: boolean;
  hasMore: boolean;
  loadAll: () => Promise<void>;
  onClose: () => void;
};

export default function SearchPanel({
  entries,
  loading,
  hasMore,
  loadAll,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const isLoading = loading;
  const typed = useTypewriter(
    isLoading
      ? "📖 Flipping through your diary…"
      : "✨ What are you looking for today?",
    45
  );

  useEffect(() => {
    if (hasMore) loadAll();
  }, [hasMore, loadAll]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(query.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const results = debounced
    ? entries.filter(
        (e) =>
          e.title.toLowerCase().includes(debounced) ||
          e.content.toLowerCase().includes(debounced)
      )
    : [];

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          className="w-full"
          placeholder="🔍 Search your diary… 🧠 thoughts • 📖 memories • ✨ moments"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="danger-text" title="Close search" onClick={onClose}>
          ❌
        </button>
      </div>

      {!isLoading && !debounced && (
        <p className="mt-4 text-center opacity-60">{typed}</p>
      )}

      {!isLoading && debounced && (
        <p className="text-sm opacity-70 mt-3">
          🎯 Found <strong>{results.length}</strong> memor
          {results.length !== 1 ? "ies" : "y"} for “
          <span className="italic">{query}</span>”
        </p>
      )}

      {!isLoading && debounced && results.length === 0 && (
        <p className="mt-6 text-center opacity-60">
          🌙 Nothing stirred for “{query}”
        </p>
      )}

      {!isLoading && debounced && results.length > 0 && (
        <EntryList entries={results} highlight={debounced} />
      )}
    </div>
  );
}
