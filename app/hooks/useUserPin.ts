import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export function useUserPin() {
  const { user } = useAuth();
  const [state, setState] = useState<{
    status: "GEN" | "NEW";
    pin?: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          pinStatus: "NEW",
        });
        setState({ status: "NEW" });
        return;
      }

      const data = snap.data();
      setState({
        status: data.pinStatus === "GEN" ? "GEN" : "NEW",
        pin: data.pin,
      });
    })();
  }, [user]);

  return state;
}
