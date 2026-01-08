import { MoodKey, MOODS } from "../constants/mood";
import "./../styles/entry.css";
import Content from "./Content";

type Props = {
  id: string;
  title: string;
  date: string;
  content: string;
  moods: MoodKey[];
  highlight?: string;
  onDelete: () => void;
  onEdit: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
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
  highlight,
  onDelete,
  onEdit,
  menuOpen,
  onMenuToggle,
}: Props) {
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

      <Content content={content} highlight={highlight} />
    </div>
  );
}
