"use client";

import { useCallback, useEffect, useState } from "react";

interface UsageState {
  limit: number;
  used: number;
  remaining: number;
  resetsOn: string;
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/usage", {
        cache: "no-store",
      });

      if (response.status === 401) {
        setUsage(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load usage right now.");
      }

      const data = (await response.json()) as UsageState;
      setUsage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load usage right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    usage,
    loading,
    error,
    refresh,
  };
}
