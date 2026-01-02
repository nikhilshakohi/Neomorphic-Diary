import "./../styles/entry.css";
import Content from "./Content";

type Props = {
  id: string;
  title: string;
  date: string;
  content: string;
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

      <Content content={content} highlight={highlight} />
    </div>
  );
}
