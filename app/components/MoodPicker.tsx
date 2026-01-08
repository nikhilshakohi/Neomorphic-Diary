import { useState } from "react";
import { MOODS, MoodKey } from "../constants/mood";

export default function MoodPicker({
  moods,
  onToggle,
}: {
  moods: MoodKey[];
  onToggle: (m: MoodKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        title="Add mood"
        onClick={() => setOpen((o) => !o)}
        className={`my-1 ${open ? "pressed" : ""}`}
      >
        🙂 Emote
      </button>

      {open && (
        <div className="flex gap-2 flex-wrap my-2">
          {Object.entries(MOODS).map(([key, emoji]) => {
            const k = key as MoodKey;
            const selected = moods.includes(k);
            const label = k[0].toUpperCase() + k.slice(1);

            return (
              <button
                key={k}
                type="button"
                onClick={() => onToggle(k)}
                className={`emoji-btn ${selected ? "pressed" : ""}`}
              >
                {emoji}
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
