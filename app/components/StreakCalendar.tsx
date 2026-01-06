"use client";

import { useEffect, useRef } from "react";

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const fmtTitle = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  const weekday = d.toLocaleString("default", { weekday: "short" });
  return `${day}-${month}-${year} (${weekday})`;
};

export default function StreakCalendar({ dates }: { dates: string[] }) {
  const active = new Set(dates);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const start = new Date(today.getFullYear() - 1, today.getMonth(), 1);
  const currentLabel = today.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const months = [];
  for (let c = new Date(start); c <= today; c.setMonth(c.getMonth() + 1)) {
    const y = c.getFullYear();
    const m = c.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const days = [
      ...Array(first.getDay()).fill(null),
      ...Array.from({ length: last.getDate() }, (_, i) =>
        fmtDate(new Date(y, m, i + 1))
      ),
    ];

    while (days.length % 7) days.push(null);

    months.push({
      label: first.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      days,
    });
  }

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      left: scrollerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="mt-4 relative">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-linear-to-r from-(--bg) to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-(--bg) to-transparent" />

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar px-2"
      >
        {months.map(({ label, days }) => (
          <div key={label} className="shrink-0">
            <div
              className={`mb-2 text-xs text-center ${
                label === currentLabel ? "opacity-100 highlight" : "opacity-70"
              }`}
            >
              {label}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => (
                <div
                  key={d ?? i}
                  title={d ? fmtTitle(d) : ""}
                  className={`h-3 w-3 rounded-sm ${
                    d
                      ? active.has(d)
                        ? "bg-green-500"
                        : "bg-(--dark)"
                      : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
