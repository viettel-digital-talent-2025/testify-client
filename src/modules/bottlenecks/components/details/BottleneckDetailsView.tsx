"use client";
import { selectViewMode } from "@/bottlenecks/slices/bottlenecksSlice";
import { BottleneckRunHistory } from "@/bottlenecks/types/bottleneck";
import { useAppSelector } from "@/shared/hooks";
import { Card } from "antd";
import { RunHistorySummary, ViewByFlow, ViewBySeverity } from ".";

export default function BottleneckDetailsView({
  runHistory,
}: {
  runHistory: BottleneckRunHistory;
}) {
  const viewMode = useAppSelector(selectViewMode);
  return (
    <Card
      style={{
        flex: 1,
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <RunHistorySummary runHistory={runHistory} />
      {viewMode === "by-flow" ? (
        <ViewByFlow runHistory={runHistory} />
      ) : (
        <ViewBySeverity runHistory={runHistory} />
      )}
    </Card>
  );
}
