import { DiaryEntry } from "@/app/hooks/useDiaryEnries";
import { useTypewriter } from "@/app/hooks/useTypewriter";
import EntryList from "../diary/EntryList";

type Props = {
  entries: DiaryEntry[];
  loading: boolean;
  onClose: () => void;
};

export default function OnThisDayPanel({ entries, loading, onClose }: Props) {
  const typed = useTypewriter(
    loading
      ? "📖 Flipping through your diary…"
      : "🕰️ On this day, once upon a time…",
    45
  );

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const onThisDayPrevYears = entries.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getDate() === day && d.getMonth() === month && d.getFullYear() < year
    );
  });

  const sameDayPrevMonths = entries.filter((e) => {
    const d = new Date(e.date);

    const isSameDay = d.getDate() === day;

    const isBeforeThisMonth =
      d.getFullYear() < today.getFullYear() ||
      (d.getFullYear() === today.getFullYear() && d.getMonth() < month);

    return isSameDay && isBeforeThisMonth;
  });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <p className="opacity-70 text-sm">{typed}</p>
        <button className="danger-text" onClick={onClose}>
          ❌
        </button>
      </div>

      {!loading &&
        onThisDayPrevYears.length === 0 &&
        sameDayPrevMonths.length === 0 && (
          <p className="mt-6 text-center opacity-60">
            🌙 No memories for this date yet.
          </p>
        )}

      {!loading && onThisDayPrevYears.length > 0 && (
        <>
          <div className="text-sm opacity-70 mb-2 animate-[fade_1s_ease-out]">
            🗓️ <strong>{day}</strong>{" "}
            {today.toLocaleString("en-US", { month: "long" })} — previous years
          </div>
          <EntryList entries={onThisDayPrevYears} />
        </>
      )}
      {!loading && sameDayPrevMonths.length > 0 && (
        <>
          <div className="text-sm opacity-70 mt-6 mb-2 animate-[fade_1s_ease-out]">
            📆 Same day — previous months
          </div>
          <EntryList entries={sameDayPrevMonths} />
        </>
      )}
    </div>
  );
}
