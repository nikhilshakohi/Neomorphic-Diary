export default function EyeButton({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <button className="eye-btn fadeIcon" onClick={onClick}>
      {show ? "🙈" : "👁️"}
    </button>
  );
}
