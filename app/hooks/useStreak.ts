import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const computeStreaks = (dates: string[]) => {
  const unique = [...new Set(dates)].sort((a, b) => b.localeCompare(a));
  if (!unique.length) return { current: 0, max: 0 };

  let current = 1,
    max = 1,
    temp = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    prev.setDate(prev.getDate() - 1);

    if (prev.toDateString() === curr.toDateString()) {
      max = Math.max(max, ++temp);
      current++;
    } else {
      temp = 1;
      break;
    }
  }

  return { current, max };
};

export const useStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState({ current: 0, max: 0 });

  useEffect(() => {
    if (!user?.email) return;

    getDocs(
      query(
        collection(db, "contents"),
        where("email", "==", user.email),
        orderBy("contentDate", "desc")
      )
    ).then((snap) =>
      setStreak(computeStreaks(snap.docs.map((d) => d.data().contentDate)))
    );
  }, [user?.email]);

  return streak;
};
