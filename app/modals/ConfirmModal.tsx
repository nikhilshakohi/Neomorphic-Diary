import "./../styles/modal.css";

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card card">
        <div className="text-xl font-semibold mb-4">⚠️ Just checking</div>
        <p className="opacity-80 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button className="danger-text" onClick={onConfirm}>
            Yes, do it 🔥
          </button>
          <button onClick={onCancel}>Nope, cancel 🙅‍♂️</button>
        </div>
      </div>
    </div>
  );
}
