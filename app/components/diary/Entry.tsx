import { useState } from "react";
import { MoodKey, MOODS } from "../../constants/mood";
import "./../../styles/entry.css";
import Content from "./Content";

type Props = {
  id: string;
  title: string;
  date: string;
  content: string;
  moods: MoodKey[];
  createdAt?: string;
  editHistory: string[];
  highlight?: string;
  onDelete: () => void;
  onEdit: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
};

const formatHistoryDate = (value: string) => {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  return `${day}-${month}-${year} (${weekday})`;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Entry({
  title,
  date,
  content,
  moods,
  createdAt,
  editHistory,
  highlight,
  onDelete,
  onEdit,
  menuOpen,
  onMenuToggle,
}: Props) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const history = [
    ...[...editHistory].reverse().map((editedAt) => ({
      label: `Edited: ${formatHistoryDate(editedAt)}`,
      key: editedAt,
    })),
    {
      label: `Created: ${formatHistoryDate(createdAt ?? date)}`,
      key: "created",
    },
  ];

  return (
    <div className="card list">
      <div className="item-header">
        <div className="flex items-center gap-2">
          <div className="item-icon">🕘</div>

          <div>
            <div className="text-lg font-semibold uppercase">{title}</div>
            <div className="text-xs opacity-70">{formatDate(date)}</div>
          </div>
        </div>

        <div className="item-menu">
          <button onClick={(e) => (e.stopPropagation(), onMenuToggle())}>
            ⋮
          </button>

          {menuOpen && (
            <div className="menu-popup">
              <button onClick={onEdit}>Edit</button>
              <button className="danger-text" onClick={onDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {moods.length > 0 && (
        <div className="flex gap-1 my-2 cursor-pointer">
          {moods.map((m) => (
            <span
              key={m}
              title={m[0].toUpperCase() + m.slice(1)}
              className="emoji"
            >
              {MOODS[m]}
            </span>
          ))}
        </div>
      )}

      <Content
        content={content}
        highlight={highlight}
        showHistory={editHistory.length > 0}
        historyOpen={historyOpen}
        onToggleHistory={() => setHistoryOpen((open) => !open)}
      />

      {historyOpen && (
        <div className="entry-history" aria-label="Entry history">
          <div className="entry-history-items">
            {history.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                className={index === 0 ? "entry-history-current" : undefined}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
