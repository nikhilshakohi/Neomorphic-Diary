"use client";

import { useState } from "react";
import "./../styles/modal.css";
import useToggle from "../hooks/useToggle";
import { usePin } from "../context/PinContext";
import { useAuth } from "../context/AuthContext";
import { useUserPin } from "../hooks/useUserPin";
import Alert from "../components/Alert";
import EyeButton from "../components/EyeButton";
import ConfirmModal from "./ConfirmModal";
import { useTypewriter } from "../hooks/useTypewriter";
import { createPin, resetPin, verifyPin } from "../services/pin";

export default function PinModal() {
  const { unlock } = usePin();
  const { user, logout } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "there";

  const [showPin, togglePin] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const resettingText = useTypewriter(
    resetting ? "Resetting your PIN…" : "",
    25
  );

  const pinData = useUserPin();
  if (!pinData) return null;

  const { status, pin: storedPin } = pinData;
  const isNew = status === "NEW";

  async function submit() {
    if (!pin) return setError("🔢 Enter your PIN");
    if (isNew && pin !== confirm) return setError("❌ PINs don't match");

    if (!isNew) {
      const ok = await verifyPin(pin, storedPin);
      if (!ok) return setError("❌ Incorrect PIN");
      unlock();
      return;
    }

    await createPin(user!, pin);
    unlock();
  }

  async function handleForgotPin() {
    if (!user) return;

    setConfirmReset(false);
    setResetting(true);

    await resetPin(user);
    await logout();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card card pin-card">
        <h2 className="text-xl font-semibold mb-1">
          {isNew ? "🔐 Your Diary, Locked" : "🛡️ Welcome Back"}
        </h2>
        <p className="text-sm opacity-60 mb-7">
          Signed in as <strong>{name}</strong>
        </p>

        <p className="opacity-70 text-sm mb-10">
          {isNew
            ? "Set a PIN once. Your thoughts stay private ✨"
            : "Enter your PIN to unlock your memories 📖"}
        </p>

        <div className="relative w-50 m-auto">
          <input
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            maxLength={6}
            autoFocus
            placeholder={isNew ? "Create PIN" : "Enter PIN"}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
          />
          <EyeButton show={showPin} onClick={togglePin} />
        </div>

        {isNew && (
          <div className="relative mt-2  w-50 m-auto">
            <input
              type={showConfirm ? "text" : "password"}
              inputMode="numeric"
              maxLength={6}
              placeholder="Confirm PIN"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
            />
            <EyeButton show={showPin} onClick={toggleConfirm} />
          </div>
        )}

        {error && <Alert message={error} onClose={() => setError("")} />}

        {resetting && (
          <p className="text-sm opacity-60 mt-6 text-center">{resettingText}</p>
        )}

        <div className="flex justify-between mt-10">
          <button onClick={submit}>Unlock 🔓</button>
          <button
            className="danger-text"
            disabled={resetting}
            onClick={() => {
              if (isNew) logout();
              else setConfirmReset(true);
            }}
          >
            {resetting ? "Resetting…" : isNew ? "Logout" : "Forgot PIN?"}
          </button>
        </div>
      </div>

      {confirmReset && (
        <ConfirmModal
          message="This will log you out and require you to set a new PIN after signing in again."
          onConfirm={handleForgotPin}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
