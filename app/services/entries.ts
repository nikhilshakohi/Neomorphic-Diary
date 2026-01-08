import { MoodKey } from "../constants/mood";

type EntryPayload = {
  title: string;
  date: string;
  content: string;
  moods: MoodKey[];
};

export async function createEntry(
  entry: EntryPayload,
  addEntry: (e: EntryPayload) => Promise<void>
) {
  validateEntry(entry);

  try {
    await addEntry(entry);
  } catch {
    throw new Error("Failed to save entry. Please try again.");
  }
}

function validateEntry({ title, date, content }: EntryPayload) {
  if (!content.trim()) {
    throw new Error("Write something about your day ✍️");
  }
  if (!title.trim()) {
    throw new Error("Title is required");
  }
  if (!date) {
    throw new Error("Please select a valid date");
  }
}
