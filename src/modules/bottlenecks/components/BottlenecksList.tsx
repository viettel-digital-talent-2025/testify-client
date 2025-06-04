"use client";
import { useGetBottlenecksRunHistoryQuery } from "@/bottlenecks/apis/bottlenecksApi";
import {
  selectSelectedRunHistoryId,
  setSelectedRunHistoryId,
} from "@/bottlenecks/slices/bottlenecksSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import type { CardProps } from "antd";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { BottlenecksGroupCard } from "./list";
const { Text, Title } = Typography;

export default function BottlenecksList() {
  const dispatch = useAppDispatch();
  const { data: runHistories, isLoading } = useGetBottlenecksRunHistoryQuery();
  const selectedRunHistoryId = useAppSelector(selectSelectedRunHistoryId);

  useEffect(() => {
    if (runHistories?.length && !selectedRunHistoryId) {
      dispatch(setSelectedRunHistoryId(runHistories[0].id));
    }
  }, [dispatch, runHistories, selectedRunHistoryId]);

  const handleRunHistoryClick = useCallback(
    (id: string) => {
      dispatch(
        setSelectedRunHistoryId(id === selectedRunHistoryId ? null : id),
      );
    },
    [dispatch, selectedRunHistoryId],
  );

  const isSelected = useCallback(
    (id: string) => id === selectedRunHistoryId,
    [selectedRunHistoryId],
  );

  const lastUpdated = useMemo(() => dayjs().format("YYYY-MM-DD HH:mm:ss"), []);

  const cardStyles = useMemo<CardProps>(
    () => ({
      style: {
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column" as const,
      },
      styles: {
        body: {
          height: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
        },
      },
    }),
    [],
  );

  const headerContent = useMemo(
    () => (
      <div className="mb-2 flex flex-col gap-2">
        <Title level={4} style={{ marginBottom: 0 }}>
          Test Run Histories
        </Title>
        <Text type="secondary">Last updated: {lastUpdated}</Text>
      </div>
    ),
    [lastUpdated],
  );

  const listContent = useMemo(() => {
    if (isLoading) {
      return <Card loading={isLoading} />;
    }

    return runHistories?.map((history) => (
      <BottlenecksGroupCard
        key={history.id}
        handleRunHistoryClick={handleRunHistoryClick}
        isSelected={isSelected}
        history={history}
      />
    ));
  }, [isLoading, runHistories, handleRunHistoryClick, isSelected]);

  return (
    <Card {...cardStyles}>
      {headerContent}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {listContent}
      </div>
    </Card>
  );
}
