export default function EyeButton({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="eye-btn fadeIcon"
      aria-label={show ? "Hide PIN" : "Show PIN"}
      onClick={onClick}
    >
      {show ? "🙈" : "👁️"}
    </button>
  );
}
