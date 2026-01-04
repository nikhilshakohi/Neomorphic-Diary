import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { hashPin } from "@/utils/pin";
import { User } from "firebase/auth";

export async function verifyPin(inputPin: string, storedPin?: string) {
  if (!storedPin) return false;
  const hashed = await hashPin(inputPin);
  return hashed === storedPin;
}

export async function createPin(user: User, pin: string) {
  const hashed = await hashPin(pin);
  await updateDoc(doc(db, "users", user.uid), {
    pinStatus: "GEN",
    pin: hashed,
  });
}

export async function resetPin(user: User) {
  await updateDoc(doc(db, "users", user.uid), {
    pinStatus: "NEW",
    pin: null,
  });
}
