import { useState } from "react";
import "./../styles/auth.css";
import useToggle from "../hooks/useToggle";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, togglePassword] = useToggle();
  const { login, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="section">
      <div className="card authCard">
        <h1 className="auth-title">👋 Welcome Back</h1>

        <div className="px-20">
          <div className="relative">
            <span className="input-icon fadeIcon">📧</span>
            <input
              className="authInput"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>
          <div className="relative">
            <span className="input-icon fadeIcon">🔒</span>
            <input
              className="authInput"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              className="eye-btn fadeIcon"
              onClick={togglePassword}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <Alert message={error} onClose={() => setError("")} />}

          <div className="flex justify-between mt-4">
            <button
              className="authButton"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Logging in..." : "Login 🚀"}
            </button>

            <button
              className="authButton"
              disabled={loading}
              onClick={loginWithGoogle}
            >
              Continue with Google 🌍
            </button>
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
