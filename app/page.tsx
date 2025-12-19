"use client";

import { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Header from "./components/Header";
import Section from "./components/Section";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, initializing } = useAuth();
  if (initializing) return null;

  return (
    <main>
      <Header />
      {user ? (
        <Section />
      ) : mode === "login" ? (
        <Login onSwitch={() => setMode("signup")} />
      ) : (
        <Signup onSwitch={() => setMode("login")} />
      )}
    </main>
  );
}
