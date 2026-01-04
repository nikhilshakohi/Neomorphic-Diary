import Entry from "./Entry";
import { DiaryEntry } from "../hooks/useDiaryEnries";

type EntryListProps = {
  entries: DiaryEntry[];
  openMenuId: string | null;
  setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  highlight?: string;
  onEdit?: (entry: DiaryEntry) => void;
  onDelete?: (id: string) => void;
};

export default function EntryList({
  entries,
  openMenuId,
  setOpenMenuId,
  highlight,
  onEdit,
  onDelete,
}: EntryListProps) {
  return (
    <>
      {entries.map((e) => (
        <Entry
          key={e.id}
          {...e}
          highlight={highlight}
          menuOpen={openMenuId === e.id}
          onMenuToggle={() =>
            setOpenMenuId((prev) => (prev === e.id ? null : e.id))
          }
          onEdit={() => onEdit?.(e)}
          onDelete={() => onDelete?.(e.id)}
        />
      ))}
    </>
  );
}
