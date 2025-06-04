"use client";

import {
  selectViewMode,
  setViewMode,
  ViewMode,
} from "@/bottlenecks/slices/bottlenecksSlice";
import { BottleneckRunHistory } from "@/bottlenecks/types/bottleneck";
import { getRunHistoryStatusColor } from "@/scenarios/utils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Radio, RadioChangeEvent, Statistic, Tag } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useMemo } from "react";

// Run History Summary Component
export default function RunHistorySummary({
  runHistory,
}: {
  runHistory: BottleneckRunHistory;
}) {
  const dispatch = useAppDispatch();
  const formattedRunAt = useMemo(
    () => formatDistanceToNow(new Date(runHistory.runAt), { addSuffix: true }),
    [runHistory.runAt],
  );

  const viewMode = useAppSelector(selectViewMode);
  const handleViewModeChange = useCallback(
    (e: RadioChangeEvent) => {
      dispatch(setViewMode(e.target.value as ViewMode));
    },
    [dispatch],
  );

  return (
    <div className="mb-2">
      <div className="mb-2 flex items-start justify-between">
        <div className="">
          <Title level={4}>{runHistory.scenario.name}</Title>
          <div>
            <Tag color={getRunHistoryStatusColor(runHistory.status)}>
              {runHistory.status}
            </Tag>
            <Text type="secondary">{formattedRunAt}</Text>
          </div>
        </div>

        <Radio.Group
          value={viewMode}
          onChange={handleViewModeChange}
          buttonStyle="solid"
        >
          <Radio.Button value="by-flow">View by Flow</Radio.Button>
          <Radio.Button value="by-severity">View by Severity</Radio.Button>
        </Radio.Group>
      </div>

      <div className="flex justify-between">
        <Statistic
          title="VUs"
          value={runHistory.vus}
          prefix={<UserOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Duration"
          value={runHistory.duration}
          suffix="s"
          prefix={<ClockCircleOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Success Rate"
          value={runHistory.successRate}
          precision={1}
          suffix="%"
          prefix={<CheckCircleOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Error Rate"
          value={runHistory.errorRate}
          precision={3}
          suffix="%"
          prefix={<CloseCircleOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Avg Response Time"
          value={runHistory.avgResponseTime}
          precision={0}
          suffix="ms"
          prefix={<ClockCircleOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Requests/sec"
          value={runHistory.requestsPerSecond}
          precision={1}
          prefix={<ThunderboltOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
      </div>
    </div>
  );
}
