"use client";

import { useState } from "react";
import "./../styles/modal.css";
import useToggle from "../hooks/useToggle";
import { usePin } from "../context/PinContext";
import { useAuth } from "../context/AuthContext";
import { useUserPin } from "../hooks/useUserPin";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Alert from "../components/Alert";
import { hashPin } from "@/utils/pin";
import EyeButton from "../components/EyeButton";

export default function PinModal() {
  const { unlock } = usePin();
  const { user, logout } = useAuth();

  const [showPin, togglePin] = useToggle();
  const [showConfirm, toggleConfirm] = useToggle();

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const pinData = useUserPin();
  if (!pinData) return null;

  const { status, pin: storedPin } = pinData;
  const isNew = status === "NEW";

  async function submit() {
    if (!pin) return setError("🔢 Enter your PIN");
    if (isNew && pin !== confirm) return setError("❌ PINs don't match");

    const hashed = await hashPin(pin);

    if (!isNew) {
      if (hashed !== storedPin) return setError("❌ Incorrect PIN");

      unlock();
      return;
    }

    await updateDoc(doc(db, "users", user!.uid), {
      pinStatus: "GEN",
      pin: hashed,
    });

    unlock();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card card pin-card">
        <h2 className="text-xl font-semibold mb-1">
          {isNew ? "🔐 Your Diary, Locked" : "🛡️ Welcome Back"}
        </h2>

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

        <div className="flex justify-between mt-10">
          <button onClick={submit}>Unlock 🔓</button>
          <button className="danger-text" onClick={logout}>
            Forgot PIN?
          </button>
        </div>
      </div>
    </div>
  );
}
