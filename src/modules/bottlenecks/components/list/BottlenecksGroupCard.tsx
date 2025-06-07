"use client";
import { getScenarioStatsIcon } from "@/scenarios/utils";
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
              {history.countHigh > 0 && (
                <Tag style={{ marginRight: 0 }} color="red">
                  {history.countHigh} High
                </Tag>
              )}
              {history.countMedium > 0 && (
                <Tag style={{ marginRight: 0 }} color="orange">
                  {history.countMedium} Medium
                </Tag>
              )}
              {history.countLow > 0 && (
                <Tag style={{ marginRight: 0 }} color="green">
                  {history.countLow} Low
                </Tag>
              )}
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
            {getScenarioStatsIcon("avgLatency")}{" "}
            <Text type="secondary">{history.avgLatency.toFixed(1)}ms</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("p95Latency")}{" "}
            <Text type="secondary">{history.p95Latency.toFixed(1)}ms</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("throughput")}{" "}
            <Text type="secondary">{history.throughput.toFixed(1)}req/s</Text>
          </Text>
          <Text>
            {getScenarioStatsIcon("errorRate")}
            <Text type="secondary">{history.errorRate.toFixed(3)}%</Text>
          </Text>
        </div>
      </div>
    </Card>
  );
}
