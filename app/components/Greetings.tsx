"use client";

export default function Greetings() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="grid place-items-center text-xl font-semibold">
      {greeting}, Sir 🙂
    </div>
  );
}
