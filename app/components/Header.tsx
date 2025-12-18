"use client";

import { useState } from "react";
import "./../styles/header.css";

const LIGHT = "light";
const DARK = "dark";
const CURRENT_THEME = LIGHT;

export default function Header() {
  const [theme, setTheme] = useState(CURRENT_THEME);
  const isDark = theme === DARK;

  function toggleTheme() {
    const newTheme = theme === DARK ? LIGHT : DARK;
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
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
        <button>👤PROFILE</button>
        <button className="danger-text">LOGOUT</button>
      </div>
    </header>
  );
}
