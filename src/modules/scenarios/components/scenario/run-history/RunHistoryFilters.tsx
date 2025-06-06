"use client";
import {
  selectRunHistoryParams,
  selectSelectedRuns,
  setIsCompareModalVisible,
  setParams,
} from "@/scenarios/slices/runHistoriesSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { BarChartOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space } from "antd";
import Search from "antd/es/input/Search";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
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
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounce(searchValue, 500);

  useEffect(() => {
    dispatch(setParams({ search: debouncedValue }));
    console.log(debouncedValue);
  }, [dispatch, debouncedValue]);

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <Search
      allowClear
      placeholder="Search status, metrics, etc..."
      value={searchValue}
      onChange={onSearchChange}
      style={{ width: 250 }}
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
  const runs = useAppSelector(selectSelectedRuns);

  const onCompare = useCallback(() => {
    dispatch(setIsCompareModalVisible(true));
  }, [dispatch]);

  return (
    <Button
      type="primary"
      icon={<BarChartOutlined />}
      onClick={onCompare}
    >
      Compare ({runs.length})
    </Button>
  );
};
