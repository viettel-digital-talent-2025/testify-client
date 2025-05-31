"use client";
import { setSelectedRunHistory } from "@/dashboard/slices/dashboardSlice";
import { RunHistory } from "@/scenarios/types/runHistory";
import {
  getRunHistoryStatusColor,
  getScenarioStatsIcon,
} from "@/scenarios/utils";
import { useAppDispatch } from "@/shared/hooks";
import {
  CheckOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Tag } from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";

export default function RunHistoryCard({ history }: { history: RunHistory }) {
  const dispatch = useAppDispatch();
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

  return (
    <Card
      hoverable
      size="small"
      style={{ marginBottom: 12 }}
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
        </Col>
        <Col span={24}>
          <div className="flex justify-between gap-2">
            <Text type="secondary">
              <ClockCircleOutlined />{" "}
              {dayjs(runAt).format("DD/MM/YYYY HH:mm:ss")}
            </Text>
            <Text>
              {getScenarioStatsIcon("vus")} {vus} VUs
            </Text>
            <Text>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {duration}s
            </Text>
            <Text>
              <ThunderboltOutlined style={{ marginRight: 4 }} />
              {avgResponseTime.toFixed(1)}ms
            </Text>

            <Text>
              <CheckOutlined style={{ marginRight: 4 }} />
              {(successRate * 100).toFixed(1)}%
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
