import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const computeStreaks = (dates: string[]) => {
  const unique = [...new Set(dates)].sort(); // ascending
  if (!unique.length) return { current: 0, max: 0 };

  let max = 1;
  let temp = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);

    prev.setDate(prev.getDate() + 1);

    if (prev.toDateString() === curr.toDateString()) {
      temp++;
      max = Math.max(max, temp);
    } else {
      temp = 1;
    }
  }

  let current = 1;
  for (let i = unique.length - 1; i > 0; i--) {
    const prev = new Date(unique[i]);
    const curr = new Date(unique[i - 1]);

    prev.setDate(prev.getDate() - 1);

    if (prev.toDateString() === curr.toDateString()) {
      current++;
    } else {
      break;
    }
  }

  return { current, max };
};

export const useStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState({
    current: 0,
    max: 0,
    dates: [] as string[],
  });

  useEffect(() => {
    if (!user?.email) return;

    getDocs(
      query(
        collection(db, "contents"),
        where("email", "==", user.email),
        orderBy("contentDate", "desc")
      )
    ).then((snap) => {
      const dates = snap.docs.map((d) => d.data().contentDate);
      const { current, max } = computeStreaks(dates);
      setStreak({ current, max, dates });
    });
  }, [user?.email]);

  return streak;
};
