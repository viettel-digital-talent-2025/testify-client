"use client";
import { bottlenecksApi } from "@/bottlenecks/apis/bottlenecksApi";
import { runHistoriesApi } from "@/scenarios/apis/runHistoryApi";
import { scenarioApi } from "@/scenarios/apis/scenarioApi";
import { setRunningJobStatus } from "@/scenarios/slices/metricsSlice";
import { LoadTestStatusEvent } from "@/scenarios/types/loadTest";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useCallback, useEffect, useRef } from "react";

export default function GlobalConnectionStatus() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/load-tests/status/${userId}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {};

    es.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as LoadTestStatusEvent;
        const { scenarioId, runHistoryId, status } = data;
        if (status) {
          dispatch(setRunningJobStatus({ scenarioId, runHistoryId, status }));
          dispatch(
            scenarioApi.util.invalidateTags([
              { type: "Scenario", id: scenarioId },
              { type: "Scenario", id: "LIST" },
            ]),
          );
          dispatch(
            runHistoriesApi.util.invalidateTags([
              { type: "RunHistory", id: "LIST" },
            ]),
          );
          dispatch(bottlenecksApi.util.invalidateTags(["Bottlenecks"]));
        }
      } catch (err) {
        console.error("Failed to parse message", err);
      }
    };

    es.onerror = () => {
      es.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 5000);
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId) return;
    connect();

    return () => {
      eventSourceRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect, userId]);

  return null;
}
