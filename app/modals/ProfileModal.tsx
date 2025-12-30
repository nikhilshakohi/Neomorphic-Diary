import "./../styles/modal.css";

export default function ProfileModal({
  user,
  onClose,
}: {
  user: { displayName?: string | null; email?: string | null };
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
        <div className="text-xl font-semibold mb-4">✨ This is you ✨</div>

        <div className="flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span className="opacity-80">
              <strong>Name:</strong> {user.displayName || "Anonymous"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>📧</span>
            <span className="opacity-80">
              <strong>Email:</strong> {user.email}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose}>Got it 👍</button>
        </div>
      </div>
    </div>
  );
}
