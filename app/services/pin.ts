import type { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { hashPin } from "@/utils/pin";

async function pinResetRequest(path: string, user: User, code?: string) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code ? { code } : {}),
  });
  const result = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(result.error ?? "PIN reset request failed.");
}

export function sendPinResetOtp(user: User) {
  return pinResetRequest("/api/pin/send-otp", user);
}

export function verifyPinResetOtp(user: User, code: string) {
  return pinResetRequest("/api/pin/verify-otp", user, code);
}

export async function verifyPin(inputPin: string, storedPin?: string) {
  if (!storedPin) return false;
  const hashed = await hashPin(inputPin);
  return hashed === storedPin;
}

export async function createPin(user: User, pin: string) {
  if (!/^\d{4,6}$/.test(pin)) throw new Error("PIN must be 4 to 6 digits.");
  const hashed = await hashPin(pin);
  await setDoc(
    doc(db, "users", user.uid),
    { email: user.email, pinStatus: "GEN", pin: hashed },
    { merge: true }
  );
}
