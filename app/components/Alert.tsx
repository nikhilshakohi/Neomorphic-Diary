import { useEffect } from "react";
import "./../styles/alert.css";

type Props = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Alert({ message, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="alert danger-text flex justify-between items-center">
      <div className="alert-text">{message}</div>
      <div>
        <button className="alert-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
