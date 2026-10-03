"use client";

import { useState } from "react";
import { useStreak } from "../../hooks/useStreak";
import StreakCalendar from "./StreakCalendar";

export default function StreakBadge({
  onDateClick,
  onRefresh,
  refreshKey,
  refreshing,
}: {
  onDateClick: (date: string) => void;
  onRefresh: () => void;
  refreshKey: number;
  refreshing: boolean;
}) {
  const { current, max, dates } = useStreak(refreshKey);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2 text-sm opacity-60">
      {current > 0 && (
        <button
          className="bg-transparent shadow-none p-0"
          onClick={() => setOpen((v) => !v)}
        >
          🔥 {current} day{current > 1 ? "s" : ""} in a row ✨
          {max > current && <span className="opacity-50"> · Best {max} 🌟</span>}
        </button>
      )}
      <button
        className="bg-transparent shadow-none p-0"
        aria-label="Refresh diary records"
        title="Refresh diary records"
        disabled={refreshing}
        onClick={onRefresh}
      >
        {refreshing ? "⏳" : "🔄"}
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
