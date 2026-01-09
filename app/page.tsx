"use client";

import { useState } from "react";
import { usePin } from "./context/PinContext";
import PinModal from "./modals/PinModal";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Section from "./pages/Section";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, initializing } = useAuth();
  const { unlocked } = usePin();

  if (initializing) return null;

  return (
    <main>
      <Header />
      {user ? (
        unlocked ? (
          <Section />
        ) : (
          <PinModal />
        )
      ) : mode === "login" ? (
        <Login onSwitch={() => setMode("signup")} />
      ) : (
        <Signup onSwitch={() => setMode("login")} />
      )}
    </main>
  );
}
