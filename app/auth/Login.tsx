import { useCallback, useState } from "react";
import "./../styles/auth.css";
import useToggle from "../hooks/useToggle";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import EyeButton from "../components/EyeButton";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, togglePassword] = useToggle();
  const { login, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const closeError = useCallback(() => setError(""), []);

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

        <div className="px-4 sm:px-20">
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
            <EyeButton show={showPassword} onClick={togglePassword} />
          </div>

          {error && <Alert message={error} onClose={closeError} />}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mt-4">
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
