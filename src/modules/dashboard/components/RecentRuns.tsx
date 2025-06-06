"use client";
import { useGetRunHistoriesQuery } from "@/scenarios/apis/runHistoryApi";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";
import dayjs from "dayjs";
import { useMemo } from "react";
import RunHistoryListCard from "./RunHistoryListCard";

export default function RecentRuns() {
  const params = useMemo(
    () => ({
      take: 3,
      skip: 0,
      status: [
        RunHistoryStatus.SUCCESS,
        RunHistoryStatus.FAILED,
        RunHistoryStatus.ABORTED,
      ],
      orderBy: "runAt" as const,
      order: "desc" as const,
      scenarioId: null,
      search: "",
      startTime: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
      endTime: null,
    }),
    [],
  );

  const { data } = useGetRunHistoriesQuery(params);

  return (
    <RunHistoryListCard
      title="Latest Scenario Runs"
      data={data?.data}
      emptyText="No recent scenario runs"
    />
  );
}
