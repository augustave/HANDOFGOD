import { useMemo, useState } from "react";

function createSessionId() {
  if ("crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID().slice(0, 8).toUpperCase();
  }
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1000).toString(36)}`.slice(0, 8).toUpperCase();
}

export function useStableSession() {
  const [sessionId] = useState(createSessionId);
  const telemetry = useMemo(
    () => ({
      lat: "0.7749",
      lng: "0.4194",
    }),
    [],
  );

  return { sessionId, telemetry };
}
