"use client";

import { useStreak } from "../hooks/useStreak";

export default function StreakBadge() {
  const { current, max } = useStreak();

  if (current <= 0) return null;

  return (
    <div className="text-sm opacity-60 text-center">
      🔥 {current} day{current > 1 ? "s" : ""} in a row ✨
      {max > current && <span className="opacity-50"> · best {max} 🌟</span>}
    </div>
  );
}
