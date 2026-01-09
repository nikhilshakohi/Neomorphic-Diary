"use client";

import { useState } from "react";
import { useStreak } from "../../hooks/useStreak";
import StreakCalendar from "./StreakCalendar";

export default function StreakBadge({
  onDateClick,
}: {
  onDateClick: (date: string) => void;
}) {
  const { current, max, dates } = useStreak();
  const [open, setOpen] = useState(false);

  if (current <= 0) return null;

  return (
    <div className="text-sm opacity-60 text-center">
      <button
        className="bg-transparent shadow-none p-0"
        onClick={() => setOpen((v) => !v)}
      >
        🔥 {current} day{current > 1 ? "s" : ""} in a row ✨
        {max > current && <span className="opacity-50"> · Best {max} 🌟</span>}
      </button>

      {open && (
        <StreakCalendar
          dates={dates}
          onSelectDate={(d) => {
            setOpen(false);
            onDateClick(d);
          }}
        />
      )}
    </div>
  );
}
