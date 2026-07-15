"use client";

import { useCallback, useEffect, useState } from "react";
import type { CountryAccessGuidance } from "@/lib/operations/guidance-shared";
import type { CrossBorderHandover } from "@/lib/operations/handover-service";
import type { CreateHandoverInput } from "@/lib/operations/handover-service";
import {
  createHandoverRequest,
  fetchGuidance,
  fetchHandovers,
  patchHandover,
} from "@/lib/operations/cross-border-client";

export type CrossBorderState = {
  handovers: CrossBorderHandover[];
  guidance: CountryAccessGuidance[];
  loading: boolean;
  refresh: () => void;
  loadGuidance: (origin: string, destination: string) => Promise<void>;
  createHandover: (input: CreateHandoverInput) => Promise<CrossBorderHandover | null>;
  handoverAction: (
    id: string,
    action: "record_consent" | "request" | "accept" | "reject" | "complete" | "cancel",
    rejectionReason?: string,
  ) => Promise<CrossBorderHandover | null>;
};

export function useCrossBorder(enabled: boolean): CrossBorderState {
  const [handovers, setHandovers] = useState<CrossBorderHandover[]>([]);
  const [guidance, setGuidance] = useState<CountryAccessGuidance[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!enabled) return;
    setLoading(true);
    void fetchHandovers().then((rows) => {
      setHandovers(rows);
      setLoading(false);
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [enabled, refresh]);

  const loadGuidance = useCallback(async (origin: string, destination: string) => {
    const rows = await fetchGuidance(origin, destination);
    setGuidance(rows);
  }, []);

  const createHandover = useCallback(async (input: CreateHandoverInput) => {
    const row = await createHandoverRequest(input);
    if (row) setHandovers((prev) => [row, ...prev.filter((h) => h.id !== row.id)]);
    return row;
  }, []);

  const handoverAction = useCallback(
    async (
      id: string,
      action: "record_consent" | "request" | "accept" | "reject" | "complete" | "cancel",
      rejectionReason?: string,
    ) => {
      const row = await patchHandover(id, action, rejectionReason);
      if (row) {
        setHandovers((prev) => prev.map((h) => (h.id === id ? row : h)));
      }
      return row;
    },
    [],
  );

  return {
    handovers,
    guidance,
    loading,
    refresh,
    loadGuidance,
    createHandover,
    handoverAction,
  };
}
