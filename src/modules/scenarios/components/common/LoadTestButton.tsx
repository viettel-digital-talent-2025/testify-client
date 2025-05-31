"use client";
import {
  useRunLoadTestMutation,
  useStopLoadTestMutation,
} from "@/scenarios/apis/loadTestApi";
import { runHistoriesApi } from "@/scenarios/apis/runHistoryApi";
import {
  selectIsScenarioRunning,
  setScenarioRunningStatus,
} from "@/scenarios/slices/metricsSlice";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { useCallback, useEffect } from "react";

interface LoadTestButtonProps {
  scenarioId: string;
}

export default function LoadTestButton({ scenarioId }: LoadTestButtonProps) {
  const isRunning = useAppSelector((state) =>
    selectIsScenarioRunning(state, scenarioId),
  );

  return (
    <Space>
      {!isRunning ? (
        <RunTestButton scenarioId={scenarioId} />
      ) : (
        <StopTestButton scenarioId={scenarioId} />
      )}
      {scenarioId && <ConnectionStatus scenarioId={scenarioId} />}
    </Space>
  );
}

function RunTestButton({ scenarioId }: LoadTestButtonProps) {
  const dispatch = useAppDispatch();
  const [runLoadTest, { isLoading: isRunLoading }] = useRunLoadTestMutation();

  const onRunTest = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const runHistory = await runLoadTest(scenarioId).unwrap();
      const status = runHistory.status;
      dispatch(setScenarioRunningStatus({ scenarioId, status }));
      dispatch(
        runHistoriesApi.util.invalidateTags([
          { type: "RunHistory", id: "LIST" },
        ]),
      );
    },
    [dispatch, scenarioId, runLoadTest],
  );

  return (
    <Button
      type="primary"
      onClick={onRunTest}
      loading={isRunLoading}
      icon={<PlayCircleOutlined />}
    >
      Run
    </Button>
  );
}

function StopTestButton({ scenarioId }: LoadTestButtonProps) {
  const dispatch = useAppDispatch();
  const [stopLoadTest, { isLoading: isStopLoading }] =
    useStopLoadTestMutation();
  useStopLoadTestMutation();

  const onStopTest = useCallback(
    async (e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();
      const runHistory = await stopLoadTest(scenarioId).unwrap();
      const status = runHistory.status;
      dispatch(setScenarioRunningStatus({ scenarioId, status }));
      dispatch(
        runHistoriesApi.util.invalidateTags([
          { type: "RunHistory", id: "LIST" },
        ]),
      );
    },
    [dispatch, scenarioId, stopLoadTest],
  );

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Popconfirm
      title="Are you sure you want to run this test?"
      onConfirm={onStopTest}
      okText="Yes"
      cancelText="No"
    >
      <Button
        danger
        loading={isStopLoading}
        icon={<StopOutlined />}
        onClick={handleButtonClick}
      >
        Stop
      </Button>
    </Popconfirm>
  );
}

function ConnectionStatus({ scenarioId }: LoadTestButtonProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!scenarioId) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/load-tests/${scenarioId}/status`;

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {};

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const status = data.status as RunHistoryStatus;
        if (status) {
          dispatch(setScenarioRunningStatus({ scenarioId, status }));
          dispatch(
            runHistoriesApi.util.invalidateTags([
              { type: "RunHistory", id: "LIST" },
            ]),
          );
          if (status !== RunHistoryStatus.RUNNING) {
            eventSource.close();
          }
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
  }, [dispatch, scenarioId]);

  return null;
}
