"use client";
import {
  selectSelectedRunHistory,
  setSelectedRunHistory,
} from "@/dashboard/slices/dashboardSlice";
import { RunHistory } from "@/scenarios/types/runHistory";
import {
  getRunHistoryStatusColor,
  getScenarioStatsIcon,
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
    vus,
    duration,
    avgResponseTime,
    successRate,
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
              {getScenarioStatsIcon("vus")}{" "}
              <Text type="secondary">{vus} VUs</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("duration")}{" "}
              <Text type="secondary">{duration}s</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("avgResponseTime")}{" "}
              <Text type="secondary">{avgResponseTime.toFixed(1)}ms</Text>
            </Text>
            <Text>
              {getScenarioStatsIcon("successRate")}{" "}
              <Text type="secondary">{(successRate * 100).toFixed(1)}%</Text>
            </Text>
          </div>
        </Col>
        <Col span={24}>
          <div className="">
            <Progress
              size="small"
              percent={progress ?? Math.floor(successRate * 100)}
              status={progress === 100 ? "success" : "active"}
              showInfo={true}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
