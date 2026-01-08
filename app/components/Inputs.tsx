import { useCallback, useState } from "react";
import { createEntry } from "../services/entries";
import Alert from "./Alert";
import { MoodKey } from "../constants/mood";
import MoodPicker from "./MoodPicker";
import { useMoods } from "../hooks/useMoods";

export default function Inputs({
  addEntry,
}: {
  addEntry: (data: {
    title: string;
    content: string;
    date: string;
    moods: MoodKey[];
  }) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const closeError = useCallback(() => setError(""), []);
  const { moods, toggleMood, resetMoods } = useMoods();

  const [form, setForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleAdd = async () => {
    setSaving(true);
    try {
      await createEntry({ ...form, moods }, addEntry);
      resetMoods();
      setForm({ ...form, title: "", content: "" });
      setExpanded(false);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <textarea
        key={expanded ? "open" : "closed"}
        rows={2}
        placeholder="How was today?"
        value={form.content}
        onFocus={() => setExpanded(true)}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        }}
      />

      {expanded && (
        <div className="meta-box">
          <div className="meta-input mb-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <MoodPicker moods={moods} onToggle={toggleMood} />

          {error && <Alert message={error} onClose={closeError} />}

          <div className="actions">
            <button onClick={handleAdd} disabled={saving}>
              {saving ? "Saving…" : "Add"}
            </button>
            <button
              className="danger-text"
              onClick={() => setExpanded(false)}
              disabled={saving}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
