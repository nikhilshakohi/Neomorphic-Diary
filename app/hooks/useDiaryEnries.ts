import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  arrayUnion,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { usePin } from "../context/PinContext";
import { db } from "../lib/firebase";
import { MoodKey } from "../constants/mood";

export type DiaryEntry = {
  id: string;
  title: string;
  date: string;
  content: string;
  moods: MoodKey[];
  createdAt?: string;
  editHistory: string[];
};

const toIsoString = (value: unknown): string | undefined => {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : undefined;
};

const PAGE_SIZE = 10;

export function useDiaryEntries() {
  const { user } = useAuth();
  const { unlocked } = usePin();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    if (!user?.email || !unlocked) return;
    setEntries([]);
    setLastDoc(null);
    setHasMore(true);
    loadMore({ initial: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const loadMore = async ({
    initial = false,
    all = false,
  }: {
    initial?: boolean;
    all?: boolean;
  }) => {
    if (!unlocked) return;
    if (loading || (!hasMore && !initial && !all)) return;

    setLoading(true);

    try {
      const q = query(
        collection(getFirestore(), "contents"),
        where("email", "==", user!.email),
        orderBy("contentDate", "desc"),
        ...(lastDoc && !initial ? [startAfter(lastDoc)] : []),
        ...(all ? [] : [limit(PAGE_SIZE)])
      );

      const snapshot = await getDocs(q);

      const newEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().contentTitle,
        date: doc.data().contentDate,
        content: doc.data().contentDetails,
        moods: doc.data().moods ?? [],
        createdAt: toIsoString(doc.data().createdAt),
        editHistory: ((doc.data().editHistory ?? []) as unknown[])
          .map(toIsoString)
          .filter((value): value is string => Boolean(value)),
      }));

      setEntries((prev) => (initial ? newEntries : [...prev, ...newEntries]));
      setLastDoc(snapshot.docs.at(-1) ?? null);
      setHasMore(!all && snapshot.docs.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async ({
    title,
    date,
    content,
    moods,
  }: {
    title: string;
    date: string;
    content: string;
    moods: MoodKey[];
  }) => {
    if (!user?.email || !content.trim()) return;

    const docRef = await addDoc(collection(db, "contents"), {
      email: user.email,
      contentTitle: title,
      contentDate: date,
      contentDetails: content,
      moods,
      createdAt: serverTimestamp(),
    });

    setEntries((prev) => [
      {
        id: docRef.id,
        title,
        date,
        content,
        moods,
        createdAt: new Date().toISOString(),
        editHistory: [],
      },
      ...prev,
    ]);
  };

  const updateEntry = async ({
    id,
    title,
    date,
    content,
    moods,
  }: {
    id: string;
    title: string;
    date: string;
    content: string;
    moods: MoodKey[];
  }) => {
    if (!user?.email) return;

    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, title, date, content, moods } : e))
    );

    const editedAt = Timestamp.now();
    await updateDoc(doc(db, "contents", id), {
      contentTitle: title,
      contentDate: date,
      contentDetails: content,
      moods,
      updatedAt: serverTimestamp(),
      editHistory: arrayUnion(editedAt),
    });

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, editHistory: [...entry.editHistory, editedAt.toDate().toISOString()] }
          : entry
      )
    );
  };

  const deleteEntry = async (id: string) => {
    if (!user?.email) return;

    setEntries((prev) => prev.filter((e) => e.id !== id));

    await deleteDoc(doc(db, "contents", id));
  };

  return {
    entries,
    loading,
    hasMore,
    loadMore,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
