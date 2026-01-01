import { useState } from "react";
import "./../styles/auth.css";
import useToggle from "../hooks/useToggle";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import EyeButton from "../components/EyeButton";

export default function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, togglePassword] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  const { signup, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(name, email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="section">
      <div className="card authCard">
        <h1 className="auth-title">✨ Start Your Diary</h1>

        <div className="px-4 sm:px-20">
          <div className="relative">
            <span className="input-icon fadeIcon">🧑</span>
            <input
              className="authInput"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </div>

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

          <div className="relative">
            <span className="input-icon fadeIcon">🔐</span>
            <input
              className="authInput"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />
            <EyeButton show={showConfirm} onClick={toggleConfirm} />
          </div>

          {error && <Alert message={error} onClose={() => setError("")} />}

          <div className="flex justify-between mt-4">
            <button
              className="authButton"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? "Creating..." : "Create My Diary 🌱"}
            </button>
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
