"use client";
import { ChangeEvent, useMemo, useCallback } from "react";
import { Space, DatePicker, Button } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  setParams,
  selectRunHistoryParams,
  setIsCompareModalVisible,
  selectSelectedRuns,
} from "@/scenarios/slices/runHistoriesSlice";
import dayjs, { Dayjs } from "dayjs";
import Search from "antd/es/input/Search";
import { selectSelectedScenarioId } from "@/scenarios/slices/scenariosSlice";
const { RangePicker } = DatePicker;

export default function RunHistoryFilters() {
  return (
    <Space>
      <SearchFilter />
      <DateRangeFilter />
      <CompareButton />
    </Space>
  );
}

const SearchFilter = () => {
  const dispatch = useAppDispatch();
  const { search } = useAppSelector(selectRunHistoryParams);

  const onSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setParams({ search: e.target.value }));
    },
    [dispatch],
  );

  return (
    <Search
      placeholder="Search by ID or scenario"
      allowClear
      value={search}
      onChange={onSearchChange}
      style={{ width: 200 }}
    />
  );
};

const DateRangeFilter = () => {
  const dispatch = useAppDispatch();
  const { startTime, endTime } = useAppSelector(selectRunHistoryParams);

  const onDateRangeChange = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      dispatch(
        setParams({
          startTime: dates?.[0]?.toISOString() ?? null,
          endTime: dates?.[1]?.toISOString() ?? null,
        }),
      );
    },
    [dispatch],
  );

  const dateRange = useMemo(() => {
    return [
      startTime ? dayjs(startTime) : null,
      endTime ? dayjs(endTime) : null,
    ] as [Dayjs | null, Dayjs | null];
  }, [startTime, endTime]);

  return (
    <RangePicker
      showTime
      needConfirm
      allowEmpty={[true, true]}
      format="YYYY-MM-DD"
      value={dateRange}
      onChange={onDateRangeChange}
    />
  );
};

const CompareButton = () => {
  const dispatch = useAppDispatch();
  const scenarioId = useAppSelector(selectSelectedScenarioId);
  const runs = useAppSelector((state) => selectSelectedRuns(state, scenarioId));

  const onCompare = useCallback(() => {
    dispatch(setIsCompareModalVisible(true));
  }, [dispatch]);

  return (
    <Button
      type="primary"
      icon={<BarChartOutlined />}
      onClick={onCompare}
      disabled={runs.length < 2}
    >
      Compare ({runs.length})
    </Button>
  );
};
