import "./../styles/auth.css";
import useToggle from "../hooks/useToggle";

export default function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, togglePassword] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  return (
    <div className="section">
      <div className="card authCard">
        <h1 className="auth-title">✨ Start Your Diary</h1>

        <div className="px-20">
          <div className="relative">
            <span className="input-icon fadeIcon">📧</span>
            <input className="authInput" type="email" placeholder="Email" />
          </div>

          <div className="relative">
            <span className="input-icon fadeIcon">🔒</span>
            <input
              className="authInput"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              className="eye-btn fadeIcon"
              onClick={togglePassword}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative">
            <span className="input-icon fadeIcon">🔐</span>
            <input
              className="authInput"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="eye-btn fadeIcon"
              onClick={toggleConfirm}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex justify-between">
            <button className="authButton">Create My Diary 🌱</button>
            <button className="authButton">Start with Google 🌍</button>
          </div>
        </div>

        <div className="auth-switch">
          Already have a diary?
          <button onClick={onSwitch}>Open it</button>
        </div>
      </div>
    </div>
  );
}
