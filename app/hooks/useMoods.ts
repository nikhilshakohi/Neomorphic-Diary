import { useState } from "react";
import { MoodKey } from "../constants/mood";

export function useMoods(initial: MoodKey[] = []) {
  const [moods, setMoods] = useState<MoodKey[]>(initial);

  const toggleMood = (m: MoodKey) =>
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );

  const resetMoods = () => setMoods([]);

  return { moods, toggleMood, resetMoods };
}
