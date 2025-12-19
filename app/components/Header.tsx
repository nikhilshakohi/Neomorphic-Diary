"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./../styles/header.css";

const LIGHT = "light";
const DARK = "dark";

export default function Header() {
  const [theme, setTheme] = useState(DARK);
  const isDark = theme === DARK;
  const { user, logout } = useAuth();

  useEffect(() => {
    const asd = () => {
      const stored = localStorage.getItem("theme") || DARK;
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    };
    asd();
  }, []);

  function toggleTheme() {
    const next = theme === DARK ? LIGHT : DARK;
    setTheme(next);
    localStorage.setItem("theme", next);
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
            <button>👤PROFILE</button>
            <button className="danger-text" onClick={logout}>
              LOGOUT
            </button>
          </>
        )}
      </div>
    </header>
  );
}
