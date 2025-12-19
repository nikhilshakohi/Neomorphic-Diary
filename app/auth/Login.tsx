import "./../styles/auth.css";
import useToggle from "../hooks/useToggle";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, togglePassword] = useToggle();

  return (
    <div className="section">
      <div className="card authCard">
        <h1 className="auth-title">👋 Welcome Back</h1>

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

          <div className="flex justify-between">
            <button className="authButton">Login 🚀</button>
            <button className="authButton">Continue with Google 🌍</button>
          </div>
        </div>
        <div className="auth-switch">
          First time here?
          <button onClick={onSwitch}>Create your diary</button>
        </div>
      </div>
    </div>
  );
}
