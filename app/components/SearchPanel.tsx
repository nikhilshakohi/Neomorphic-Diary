import { useEffect, useState } from "react";
import EntryList from "./EntryList";
import { DiaryEntry } from "../hooks/useDiaryEnries";
import { useTypewriter } from "../hooks/useTypewriter";
import FilterPanel from "./FilterPanel";

type Props = {
  entries: DiaryEntry[];
  loading: boolean;
  hasMore: boolean;
  loadAll: () => Promise<void>;
  onClose: () => void;
};

const TODAY = new Date().toISOString().slice(0, 10);

export default function SearchPanel({
  entries,
  loading,
  hasMore,
  loadAll,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const hasActiveFilter =
    Boolean(debounced) || Boolean(fromDate) || Boolean(toDate);

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

  const toggleFilters = () => {
    setShowFilters((prev) => {
      const value = prev ? null : TODAY;
      setFromDate(value);
      setToDate(value);
      return !prev;
    });
  };

  const results = entries.filter((e) => {
    if (debounced) {
      const text = `${e.title} ${e.content}`.toLowerCase();
      if (!debounced.split(/\s+/).every((w) => text.includes(w))) return false;
    }

    if (fromDate && e.date < fromDate) return false;
    if (toDate && e.date > toDate) return false;

    return true;
  });

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
        <button onClick={toggleFilters}>⚙️</button>
        <button className="danger-text" title="Close search" onClick={onClose}>
          ❌
        </button>
      </div>

      {showFilters && (
        <FilterPanel
          fromDate={fromDate}
          toDate={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
          onClear={() => {
            setFromDate(null);
            setToDate(null);
          }}
        />
      )}

      {!isLoading && !hasActiveFilter && (
        <p className="mt-4 text-center opacity-60">{typed}</p>
      )}

      {!isLoading && hasActiveFilter && (
        <p className="text-sm opacity-70 mt-3">
          🎯 Found{" "}
          <strong key={results.length} className="searchCount inline-block">
            {results.length}
          </strong>{" "}
          entr{results.length !== 1 ? "ies" : "y"}
        </p>
      )}

      {!isLoading && hasActiveFilter && results.length === 0 && (
        <p className="mt-6 text-center opacity-60">
          🌙 Nothing found for selected filters
        </p>
      )}

      {!isLoading && hasActiveFilter && results.length > 0 && (
        <EntryList entries={results} highlight={debounced || undefined} />
      )}
    </div>
  );
}
