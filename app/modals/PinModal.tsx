"use client";

import { useState, type FormEvent } from "react";
import "./../styles/modal.css";
import useToggle from "../hooks/useToggle";
import { usePin } from "../context/PinContext";
import { useAuth } from "../context/AuthContext";
import { useUserPin } from "../hooks/useUserPin";
import Alert from "../components/common/Alert";
import EyeButton from "../components/common/EyeButton";
import ConfirmModal from "./ConfirmModal";
import { useTypewriter } from "../hooks/useTypewriter";
import {
  createPin,
  sendPinResetOtp,
  verifyPin,
  verifyPinResetOtp,
} from "../services/pin";

export default function PinModal() {
  const { unlock } = usePin();
  const { user, logout } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "there";

  const [showPin, togglePin] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetting, setResetting] = useState(false);
  const resettingText = useTypewriter(
    resetting ? "Working on your PIN reset…" : "",
    25
  );

  const pinData = useUserPin();
  if (!pinData) return null;

  const { status, pin: storedPin } = pinData;
  const isNew = status === "NEW";

  async function submit() {
    if (!pin) return setError("🔢 Enter your PIN");
    if (isNew && !/^\d{4,6}$/.test(pin))
      return setError("🔢 Create a PIN with 4 to 6 digits");
    if (isNew && pin !== confirm) return setError("❌ PINs don't match");

    try {
      if (!isNew) {
        const ok = await verifyPin(pin, storedPin);
        if (!ok) return setError("❌ Incorrect PIN");
      } else {
        await createPin(user!, pin);
      }
      unlock();
    } catch {
      setError("Could not save your PIN. Please try again.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resetSent) await verifyResetCode();
    else await submit();
  }

  async function verifyResetCode() {
    if (!user || !pinData) return;
    if (!/^\d{6}$/.test(otp)) return setError("🔢 Enter the 6-digit email code");

    setResetting(true);
    setError("");
    try {
      await verifyPinResetOtp(user, otp);
      await pinData.refresh();
      setResetSent(false);
      setOtp("");
      setPin("");
      setConfirm("");
      setError("✅ Email verified. Create your new PIN.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify the email code.");
    } finally {
      setResetting(false);
    }
  }

  async function handleForgotPin() {
    if (!user) return;

    setConfirmReset(false);
    setResetting(true);
    setError("");
    try {
      await sendPinResetOtp(user);
      setResetSent(true);
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the email code.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal-card card pin-card" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-1">
          {isNew ? "🔐 Your Diary, Locked" : "🛡️ Welcome Back"}
        </h2>
        <p className="text-sm opacity-60 mb-7">
          Signed in as <strong>{name}</strong>
        </p>

        <p className="opacity-70 text-sm mb-10">
          {resetSent
            ? "Verify your email to reset your PIN 🔐"
            : isNew
            ? "Create a 4 to 6-digit PIN to keep your thoughts private ✨"
            : "Enter your PIN to unlock your memories 📖"}
        </p>

        {!resetSent && (
          <div className="relative w-50 m-auto">
            <input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={6}
              autoFocus
              placeholder={isNew ? "Create PIN (4-6 digits)" : "Enter PIN"}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
            />
            <EyeButton show={showPin} onClick={togglePin} />
          </div>
        )}

        {isNew && !resetSent && (
          <div className="relative mt-2  w-50 m-auto">
            <input
              type={showConfirm ? "text" : "password"}
              inputMode="numeric"
              maxLength={6}
              placeholder="Confirm PIN"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
            />
            <EyeButton show={showConfirm} onClick={toggleConfirm} />
          </div>
        )}

        {error && <Alert message={error} onClose={() => setError("")} />}

        {resetSent && (
          <div className="mt-4 text-center">
            <p className="mb-3 text-sm opacity-70">
              📬 Enter the 6-digit code we emailed you.
            </p>
            <input
              className="pin-otp-input"
              aria-label="Email verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            />
          </div>
        )}

        {resetting && (
          <p className="text-sm opacity-60 mt-6 text-center">{resettingText}</p>
        )}

        <div className="flex justify-between mt-10">
          <button type="submit" className="pin-unlock" disabled={resetting}>
            {resetSent ? "Verify code ✅" : isNew ? "Save new PIN 🔐" : "Unlock 🔓"}
          </button>
          <button
            type="button"
            className={isNew ? "danger-text" : "pin-forgot"}
            disabled={resetting}
            onClick={() => {
              if (isNew) void logout();
              else setConfirmReset(true);
            }}
          >
            {resetting ? "Sending…" : isNew ? "Logout 🚪" : "Forgot PIN?"}
          </button>
        </div>
      </form>

      {confirmReset && (
        <ConfirmModal
          message={`We'll email a 6-digit code to ${user?.email ?? "your account email"}. Verify it to reset only your PIN.`}
          onConfirm={handleForgotPin}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
