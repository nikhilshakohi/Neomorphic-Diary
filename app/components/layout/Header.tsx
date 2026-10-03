"use client";

import { useEffect, useState } from "react";
import "./../../styles/header.css";
import ProfileModal from "@/app/modals/ProfileModal";
import { useAuth } from "@/app/context/AuthContext";

const LIGHT = "light";
const DARK = "dark";
const SYSTEM = "system";

export default function Header() {
  const [theme, setTheme] = useState(DARK);
  const isDark = theme === DARK;
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (next: string) => {
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
    };

    const stored = localStorage.getItem("themePreference");
    const savedPreference =
      stored === LIGHT || stored === DARK ? stored : SYSTEM;
    localStorage.removeItem("theme");
    applyTheme(
      savedPreference === SYSTEM
        ? systemTheme.matches
          ? DARK
          : LIGHT
        : savedPreference
    );

    const followSystem = (event: MediaQueryListEvent) => {
      const preference = localStorage.getItem("themePreference");
      if (preference === SYSTEM || !preference) {
        applyTheme(event.matches ? DARK : LIGHT);
      }
    };
    systemTheme.addEventListener("change", followSystem);
    return () => systemTheme.removeEventListener("change", followSystem);
  }, []);

  function toggleTheme() {
    const preference = localStorage.getItem("themePreference") || SYSTEM;
    const nextPreference =
      preference === SYSTEM ? (theme === DARK ? LIGHT : DARK) : SYSTEM;
    const next =
      nextPreference === SYSTEM
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? DARK
          : LIGHT
        : nextPreference;
    setTheme(next);
    localStorage.setItem("themePreference", nextPreference);
    document.documentElement.setAttribute("data-theme", next);
  }
  return (
    <header>
      <div className="text-2xl font-semibold">DIARY</div>
      <div className="header-icons-div">
        <button
          className={`theme-btn ${isDark ? "spin" : ""}`}
          onClick={toggleTheme}
        >
          {isDark ? "🌙" : "☀️"}
        </button>
        {user && (
          <>
            <button onClick={() => setShowProfile(true)}>👤</button>
            <button className="danger-text" onClick={logout}>
              LOGOUT
            </button>
          </>
        )}
      </div>
      {showProfile && user && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
}
