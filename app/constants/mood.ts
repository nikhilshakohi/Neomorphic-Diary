export const MOODS = {
  calm: "😌",
  okay: "🙂",
  happy: "😄",
  worried: "😟",
  sad: "😔",
  angry: "😠",
  tired: "😴",
} as const;

export type MoodKey = keyof typeof MOODS;
