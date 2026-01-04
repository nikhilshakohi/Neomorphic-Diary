import Entry from "./Entry";
import { DiaryEntry } from "../hooks/useDiaryEnries";
import { useEffect, useState } from "react";

type EntryListProps = {
  entries: DiaryEntry[];
  highlight?: string;
  onEdit?: (entry: DiaryEntry) => void;
  onDelete?: (id: string) => void;
};

export default function EntryList({
  entries,
  highlight,
  onEdit,
  onDelete,
}: EntryListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

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
