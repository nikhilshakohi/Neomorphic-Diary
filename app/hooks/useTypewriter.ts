import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 50) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;

    const id = setInterval(() => {
      setTyped(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return typed;
}
