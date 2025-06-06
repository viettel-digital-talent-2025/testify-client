"use client";
import { useGetRunHistoriesQuery } from "@/scenarios/apis/runHistoryApi";
import {
  selectRunHistoryParams,
  selectSelectedRunIds,
  setIsDetailModalVisible,
  setParams,
  setSelectedRun,
  setSelectedRuns,
} from "@/scenarios/slices/runHistoriesSlice";
import { selectSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
import {
  RunHistory,
  RunHistoryOrderBy,
  RunHistoryStatus,
} from "@/scenarios/types/runHistory";
import { getProgressStatus } from "@/scenarios/utils";
import {
  getRunHistoryStatusColor,
  getRunHistoryStatusIcon,
} from "@/scenarios/utils/runHistoryUtils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { LineChartOutlined } from "@ant-design/icons";
import {
  Button,
  Progress,
  Space,
  Table,
  TableColumnType,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableRowSelection,
} from "antd/es/table/interface";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCallback, useMemo } from "react";

// Add timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function RunHistoryTable() {
  const dispatch = useAppDispatch();
  const scenarioId = useAppSelector(selectSelectedScenarioId);
  const params = useAppSelector(selectRunHistoryParams);
  const selectedRunIds = useAppSelector(selectSelectedRunIds);

  const { data, isLoading } = useGetRunHistoriesQuery(
    {
      scenarioId,
      ...params,
    },
    { skip: !scenarioId },
  );

  const rowSelection: TableRowSelection<RunHistory> = {
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedRunIds,
    onChange: (_selectedRowKeys: React.Key[], selectedRows: RunHistory[]) => {
      if (!scenarioId || !data?.data) return;
      dispatch(setSelectedRuns({ scenarioId, runs: selectedRows }));
    },
  };

  const onViewDetails = useCallback(
    (run: RunHistory) => {
      dispatch(setSelectedRun(run));
      dispatch(setIsDetailModalVisible(true));
    },
    [dispatch],
  );

  const onChange: TableProps<RunHistory>["onChange"] = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<RunHistory> | SorterResult<RunHistory>[],
    ) => {
      const { order = "desc", field = "createdAt" } =
        sorter as SorterResult<RunHistory>;
      const { current = 1, pageSize = 5 } = pagination;
      const { status } = filters || {};

      dispatch(
        setParams({
          skip: (current - 1) * pageSize,
          take: pageSize,
          orderBy: field as RunHistoryOrderBy,
          order: order === "ascend" ? "asc" : "desc",
          status: (status as RunHistoryStatus[]) || [],
        }),
      );
    },
    [dispatch],
  );

  const columns: TableColumnType<RunHistory>[] = useMemo(
    () => [
      {
        title: "Run Time",
        dataIndex: "runAt",
        key: "runAt",
        width: 100,
        render: (date: string) =>
          dayjs(date).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status: string) => (
          <Tag
            color={getRunHistoryStatusColor(status)}
            icon={getRunHistoryStatusIcon(status)}
          >
            {status}
          </Tag>
        ),
        filters: Object.values(RunHistoryStatus).map((status) => ({
          text: status,
          value: status,
        })),
      },
      {
        title: "Avg Latency",
        dataIndex: "avgLatency",
        key: "avgLatency",
        width: 100,
        sorter: true,
        render: (time: number) => `${time.toFixed(2)}ms`,
      },
      {
        title: "P95 Latency",
        dataIndex: "p95Latency",
        key: "p95Latency",
        width: 100,
        sorter: true,
        render: (time: number) => `${time.toFixed(2)}ms`,
      },
      {
        title: "Throughput",
        dataIndex: "throughput",
        key: "throughput",
        width: 100,
        sorter: true,
        render: (throughput: number) => `${throughput.toFixed(2)}req/s`,
      },
      {
        title: "Error Rate",
        dataIndex: "errorRate",
        key: "errorRate",
        width: 100,
        sorter: true,
        render: (rate: number) => `${(rate * 100).toFixed(2)}%`,
      },
      {
        title: "Progress",
        dataIndex: "progress",
        key: "progress",
        width: 100,
        render: (progress: number, record: RunHistory) => {
          return (
            <>
              <Progress
                size="small"
                percent={progress}
                status={getProgressStatus(progress, record.status)}
              />
            </>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        render: (_: unknown, record: RunHistory) => (
          <Space>
            <Tooltip title="View Details">
              <Button
                icon={<LineChartOutlined />}
                onClick={() => onViewDetails(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [onViewDetails],
  );

  return (
    <Table
      rowKey="id"
      size="small"
      columns={columns}
      dataSource={data?.data}
      loading={isLoading}
      rowSelection={rowSelection}
      onChange={onChange}
      pagination={{
        showSizeChanger: true,
        pageSize: params.take,
        pageSizeOptions: ["5", "10", "25", "50", "100"],
        total: data?.total,
        showTotal: (total) => `Total ${total}`,
      }}
    />
  );
}
