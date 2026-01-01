"use client";

import { createContext, useContext, useState } from "react";

const PinContext = createContext<{
  unlocked: boolean;
  unlock: () => void;
  lock: () => void;
} | null>(null);

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <PinContext.Provider
      value={{
        unlocked,
        unlock: () => setUnlocked(true),
        lock: () => setUnlocked(false),
      }}
    >
      {children}
    </PinContext.Provider>
  );
}

export const usePin = () => {
  const ctx = useContext(PinContext);
  if (!ctx) throw new Error("usePin must be used inside PinProvider");
  return ctx;
};
