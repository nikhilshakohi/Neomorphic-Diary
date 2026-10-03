import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";

type UserPinState = { status: "GEN" | "NEW"; pin?: string };

export function useUserPin() {
  const { user } = useAuth();
  const [state, setState] = useState<UserPinState | null>(null);

  const readPin = useCallback(async (): Promise<UserPinState | null> => {
    if (!user) return null;
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        pinStatus: "NEW",
      });
      return { status: "NEW" as const };
    }

    const data = snap.data();
    return {
      status: data.pin ? "GEN" : "NEW",
      pin: data.pin,
    };
  }, [user]);

  const refresh = useCallback(async () => {
    const nextState = await readPin();
    if (nextState) setState(nextState);
  }, [readPin]);

  useEffect(() => {
    let active = true;
    readPin().then((nextState) => {
      if (active && nextState) setState(nextState);
    });
    return () => {
      active = false;
    };
  }, [readPin]);

  return state ? { ...state, refresh } : null;
}
