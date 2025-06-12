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
  stepId: string;
}

const NOTIFICATION_COOLDOWN = 5000; // 5 seconds cooldown between notifications

export default function GlobalBottlenecksAlert() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { notify } = useNotification();
  const lastNotificationTime = useRef<number>(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleBottleneckNotification = useCallback(
    (data: BottleneckEvent) => {
      const now = Date.now();
      if (now - lastNotificationTime.current < NOTIFICATION_COOLDOWN) {
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

  const connect = useCallback(() => {
    if (!userId) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bottlenecks/alerts/${userId}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {};

    es.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as BottleneckEvent;
        if (data.severity) {
          handleBottleneckNotification(data);
        }
      } catch (error) {
        console.error("Error parsing bottleneck event:", error);
      }
    };

    es.onerror = () => {
      es.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 5000);
    };
  }, [handleBottleneckNotification, userId]);

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
