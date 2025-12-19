"use client";

import { useState } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Header from "./components/Header";
import Section from "./components/Section";

const isAuth = false;

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <main>
      <Header />

      {isAuth ? (
        <Section />
      ) : mode === "login" ? (
        <Login onSwitch={() => setMode("signup")} />
      ) : (
        <Signup onSwitch={() => setMode("login")} />
      )}
    </main>
  );
}
