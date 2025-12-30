import { useEffect, useState } from "react";
import "./../styles/modal.css";

export default function EditModal({
  entry,
  onSave,
  onClose,
}: {
  entry: {
    id: string;
    title: string;
    date: string;
    content: string;
  };
  onSave: (e: typeof entry) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(entry);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card card">
        <div className="text-xl font-semibold mb-4">✍️ Edit your entry</div>

        <p className="opacity-70 mb-4 text-sm">
          Tweak your thoughts. No pressure.
        </p>

        <div className="flex flex-col gap-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <textarea
            rows={8}
            placeholder="Your thoughts…"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onSave(form);
              setSaving(false);
            }}
          >
            {saving ? "Saving… ⏳" : "Save changes 💾"}
          </button>

          <button className="danger-text" disabled={saving} onClick={onClose}>
            Cancel 🙅‍♂️
          </button>
        </div>
      </div>
    </div>
  );
}
