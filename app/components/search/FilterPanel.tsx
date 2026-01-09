type Props = {
  fromDate: string | null;
  toDate: string | null;
  onFromChange: (v: string | null) => void;
  onToChange: (v: string | null) => void;
  onClear: () => void;
};

export default function FilterPanel({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  onClear,
}: Props) {
  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input
          type="date"
          value={fromDate ?? ""}
          onChange={(e) => onFromChange(e.target.value || null)}
        />
        <input
          type="date"
          value={toDate ?? ""}
          onChange={(e) => onToChange(e.target.value || null)}
        />
      </div>

      {(fromDate || toDate) && (
        <button className="text-sm mt-2 danger-text" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
