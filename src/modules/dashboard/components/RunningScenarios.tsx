"use client";
import { setSelectedRunHistory } from "@/dashboard/slices/dashboardSlice";
import { useGetRunHistoriesQuery } from "@/scenarios/apis/runHistoryApi";
import {
  selectIsRunningJob,
  setRunningJobStatus,
} from "@/scenarios/slices/metricsSlice";
import { RunHistoryStatus } from "@/scenarios/types/runHistory";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import RunHistoryListCard from "./RunHistoryListCard";

export default function RunningScenarios() {
  const dispatch = useAppDispatch();
  const isRunning = useAppSelector(selectIsRunningJob);
  const [hasSelected, setHasSelected] = useState(false);
  const params = useMemo(
    () => ({
      take: 3,
      skip: 0,
      status: [RunHistoryStatus.RUNNING],
      orderBy: "runAt" as const,
      order: "desc" as const,
      scenarioId: null,
      search: "",
      startTime: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
      endTime: null,
    }),
    [],
  );

  const { data } = useGetRunHistoriesQuery(params, {
    pollingInterval: isRunning ? 1000 : 0,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!data?.data && data?.data.length) {
      data.data.map((item) => {
        if (item.status) {
          dispatch(
            setRunningJobStatus({
              scenarioId: item.scenario.id,
              runHistoryId: item.id,
              status: item.status,
            }),
          );
        }
      });
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (data?.data && data.data.length > 0 && isRunning && !hasSelected) {
      dispatch(
        setSelectedRunHistory({
          scenarioId: data.data[0].scenario.id,
          runHistoryId: data.data[0].id,
        }),
      );
      setHasSelected(true);
    }
  }, [dispatch, data, isRunning, hasSelected]);

  useEffect(() => {
    if (!isRunning) {
      setHasSelected(false);
    }
  }, [isRunning]);

  return (
    <RunHistoryListCard
      title="Running Scenarios"
      data={isRunning ? data?.data : undefined}
      emptyText="No running scenarios"
    />
  );
}
