"use client";
import {
  getRunHistoryStatusColor,
  getScenarioStatsIcon,
} from "@/scenarios/utils";
import { colors } from "@/shared/constants/colors";
import { Card, Tag, Tooltip } from "antd";
import Text from "antd/es/typography/Text";
import { formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { BottlenecksGroup } from "../../types/bottleneck";

interface BottlenecksGroupCardProps {
  handleRunHistoryClick: (id: string) => void;
  isSelected: (id: string) => boolean;
  history: BottlenecksGroup;
}

export default function BottlenecksGroupCard({
  handleRunHistoryClick,
  isSelected,
  history,
}: BottlenecksGroupCardProps) {
  return (
    <Card
      key={history.id}
      hoverable
      onClick={() => handleRunHistoryClick(history.id)}
      style={{
        border: isSelected(history.id)
          ? `1px solid ${colors.primary}`
          : `1px solid ${colors.border}`,
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Text strong>{history.scenario.name}</Text>
            <div className="flex flex-wrap justify-end gap-2">
              <Tag style={{ marginRight: 0 }}>
                {history.countBottlenecks} bottlenecks
              </Tag>
              <Tag
                color={getRunHistoryStatusColor(history.status)}
                style={{ marginRight: 0 }}
              >
                {history.status}
              </Tag>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Tooltip title={dayjs(history.runAt).format("YYYY-MM-DD HH:mm:ss")}>
              <Text type="secondary">
                {formatDistanceToNow(new Date(history.runAt), {
                  addSuffix: true,
                })}
              </Text>
            </Tooltip>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Text>
            {getScenarioStatsIcon("vus")}{" "}
            <Text type="secondary">{history.vus} VUs</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("duration")}{" "}
            <Text type="secondary">{history.duration}s</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("errorRate")}{" "}
            <Text type="secondary">{history.errorRate.toFixed(3)}%</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("requestsPerSecond")}
            <Text type="secondary">
              {history.requestsPerSecond.toFixed(1)} req/s
            </Text>
          </Text>
        </div>
      </div>
    </Card>
  );
}
