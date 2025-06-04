"use client";
import { bottlenecksApi } from "@/bottlenecks/apis/bottlenecksApi";
import { BottleneckSeverity } from "@/bottlenecks/types/bottleneck";
import {
  useAppDispatch,
  useAppSelector,
  useNotification,
} from "@/shared/hooks";
import { useCallback, useEffect, useRef } from "react";

export interface BottleneckEvent {
  type: "bottleneck";
  severity: BottleneckSeverity;
  timestamp: string;
  userId: string;
  runHistoryId: string;
  scenarioId: string;
  scenarioName: string;
  flowId: string;
  flowName: string;
  stepId: string;
  stepName: string;
}

const NOTIFICATION_COOLDOWN = 5000; // 5 seconds cooldown between notifications

export default function GlobalBottlenecksAlert() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { notify } = useNotification();
  const lastNotificationTime = useRef<number>(0);

  const handleBottleneckNotification = useCallback(
    (data: BottleneckEvent) => {
      const now = Date.now();
      if (now - lastNotificationTime.current < NOTIFICATION_COOLDOWN) {
        console.log("Skipping notification due to cooldown");
        return;
      }

      notify({
        message: "Bottleneck Alert",
        description: `Bottleneck detected in scenario ${data.scenarioName}`,
        notiType: "error",
      });
      lastNotificationTime.current = now;
      dispatch(bottlenecksApi.util.invalidateTags(["Bottlenecks"]));
    },
    [dispatch, notify],
  );

  useEffect(() => {
    if (!userId) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bottlenecks/alerts/${userId}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {};

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as BottleneckEvent;
        console.log("Received bottleneck event:", data);
        handleBottleneckNotification(data);
      } catch (error) {
        console.error("Error parsing bottleneck event:", error);
      }
    };

    const handleError = (error: Event) => {
      console.error("SSE Error:", error);
    };

    // Add event listeners
    eventSource.addEventListener("bottlenecks", handleMessage);
    eventSource.addEventListener("error", handleError);

    // Cleanup function
    return () => {
      eventSource.removeEventListener("bottlenecks", handleMessage);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [dispatch, userId, handleBottleneckNotification]);

  return null;
}
