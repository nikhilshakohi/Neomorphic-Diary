import { useState } from "react";

export default function useToggle() {
  const [v, setV] = useState(false);
  return [v, () => setV((s) => !s)] as const;
}
