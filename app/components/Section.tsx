import Greetings from "./Greetings";
import "./../styles/section.css";
import Inputs from "./Inputs";
import Entry from "./Entry";
import { mockDiaryEntries } from "./data";

type DiaryEntry = {
  id: string | number;
  title: string;
  date: string;
  content: string;
};

const EmptyState = () => (
  <p className="mt-6 text-center opacity-60">
    No entries yet. Start writing ✍️
  </p>
);

export default function Section() {
  const entries: DiaryEntry[] = mockDiaryEntries ?? [];

  return (
    <div className="section">
      <div className="flex justify-between px-1.5">
        <Greetings />
        <div className="flex items-center gap-2 text-sm">
          <button>🗓️</button>
          <button>🔎</button>
        </div>
      </div>

      <Inputs />

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        entries.map(({ id, title, date, content }) => (
          <Entry key={id} title={title} date={date} content={content} />
        ))
      )}
    </div>
  );
}
