"use client";

import { useState } from "react";
import "./../styles/entry.css";
import Content from "./Content";

type Props = {
  title: string;
  date: string;
  content: string;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Entry({ title, date, content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="list">
      <div className="item-header">
        <div className="flex items-center gap-2">
          <div className="item-icon">🕘</div>

          <div>
            <div className="text-lg font-semibold capitalize">{title}</div>
            <div className="text-xs opacity-70">{formatDate(date)}</div>
          </div>
        </div>

        <div className="item-menu">
          <button onClick={() => setOpen((o) => !o)}>⋮</button>
          {open && (
            <div className="menu-popup">
              <button>Edit</button>
              <button className="danger-text">Delete</button>
            </div>
          )}
        </div>
      </div>

      <Content content={content} />
    </div>
  );
}
