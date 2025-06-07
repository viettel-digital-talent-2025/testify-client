"use client";
import {
  useRunLoadTestMutation,
  useStopLoadTestMutation,
} from "@/scenarios/apis/loadTestApi";
import { selectIsRunningJobByScenarioId } from "@/scenarios/slices/metricsSlice";
import { useAppSelector } from "@/shared/hooks";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { useCallback } from "react";

interface LoadTestButtonProps {
  scenarioId: string;
}

export default function LoadTestButton({ scenarioId }: LoadTestButtonProps) {
  const isRunning = useAppSelector((state) =>
    selectIsRunningJobByScenarioId(state, scenarioId),
  );

  return (
    <Space>
      {!isRunning ? (
        <RunTestButton scenarioId={scenarioId} />
      ) : (
        <StopTestButton scenarioId={scenarioId} />
      )}
    </Space>
  );
}

function RunTestButton({ scenarioId }: LoadTestButtonProps) {
  const [runLoadTest, { isLoading: isRunLoading }] = useRunLoadTestMutation();

  const onRunTest = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      await runLoadTest(scenarioId).unwrap();
    },
    [scenarioId, runLoadTest],
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
  const [stopLoadTest, { isLoading: isStopLoading }] =
    useStopLoadTestMutation();

  const onStopTest = useCallback(
    async (e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();
      await stopLoadTest(scenarioId).unwrap();
    },
    [scenarioId, stopLoadTest],
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
