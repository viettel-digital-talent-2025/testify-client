"use client";
import {
  selectSelectedRunHistory,
  setSelectedRunHistory,
} from "@/dashboard/slices/dashboardSlice";
import { RunHistory } from "@/scenarios/types/runHistory";
import {
  getRunHistoryStatusColor,
  getScenarioStatsIcon,
  getProgressStatus,
} from "@/scenarios/utils";
import { colors } from "@/shared/constants/colors";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Card, Col, Progress, Row, Tag, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";

export default function RunHistoryCard({ history }: { history: RunHistory }) {
  const dispatch = useAppDispatch();
  const selectedRunHistory = useAppSelector(selectSelectedRunHistory);
  const {
    scenario,
    status,
    runAt,
    avgLatency,
    p95Latency,
    throughput,
    errorRate,
    progress,
  } = history;

  const isSelected = history.id === selectedRunHistory?.runHistoryId;
  return (
    <Card
      hoverable
      size="small"
      style={{
        marginBottom: 12,
        border: isSelected
          ? `1px solid ${colors.primary}`
          : `1px solid ${colors.border}`,
      }}
      onClick={() =>
        dispatch(
          setSelectedRunHistory({
            scenarioId: scenario.id,
            runHistoryId: history.id,
          }),
        )
      }
    >
      <Row justify="space-between" align="middle" gutter={[4, 4]}>
        <Col span={24}>
          <div className="flex justify-between gap-2">
            <Text strong>{scenario.name}</Text>
            <Tag color={getRunHistoryStatusColor(status)} style={{ margin: 0 }}>
              {status}
            </Tag>
          </div>
          <Tooltip title={dayjs(runAt).format("YYYY-MM-DD HH:mm:ss")}>
            <Text type="secondary">
              {formatDistanceToNow(runAt, { addSuffix: true })}
            </Text>
          </Tooltip>
        </Col>
        <Col span={24}>
          <div className="flex justify-between gap-2">
            <Text>
              {getScenarioStatsIcon("avgLatency")}{" "}
              <Text type="secondary">{avgLatency.toFixed(2)}ms</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("p95Latency")}{" "}
              <Text type="secondary">{p95Latency.toFixed(2)}ms</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("throughput")}{" "}
              <Text type="secondary">{throughput.toFixed(2)}req/s</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("errorRate")}{" "}
              <Text type="secondary">{errorRate.toFixed(2)}%</Text>
            </Text>
          </div>
        </Col>
        <Col span={24}>
          <div className="">
            <Progress
              size="small"
              percent={progress ?? Math.floor(errorRate * 100)}
              status={getProgressStatus(progress, status)}
              showInfo={true}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
