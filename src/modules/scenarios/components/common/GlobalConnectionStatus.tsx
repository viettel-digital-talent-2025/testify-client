"use client";
import { bottlenecksApi } from "@/bottlenecks/apis/bottlenecksApi";
import { runHistoriesApi } from "@/scenarios/apis/runHistoryApi";
import { setScenarioRunningStatus } from "@/scenarios/slices/metricsSlice";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";

interface ScenarioStatusUpdate {
  userId: string;
  scenarioId: string;
  runHistoryId: string;
  status: RunHistoryStatus;
  type: string;
  id: string;
  retry: number;
}

export default function GlobalConnectionStatus() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/load-tests/status/${userId}`;

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {};

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as ScenarioStatusUpdate;
        const { scenarioId, status } = data;
        if (status) {
          dispatch(setScenarioRunningStatus({ scenarioId, status }));
          dispatch(
            runHistoriesApi.util.invalidateTags([
              { type: "RunHistory", id: "LIST" },
            ]),
          );
          dispatch(bottlenecksApi.util.invalidateTags(["Bottlenecks"]));
        }
      } catch {}
    };

    const handleError = (error: Event) => {
      console.error("SSE Error:", error);
    };

    // Add event listeners
    eventSource.addEventListener("message", handleMessage);
    eventSource.addEventListener("error", handleError);

    // Cleanup function
    return () => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [dispatch, userId]);

  return null;
}
