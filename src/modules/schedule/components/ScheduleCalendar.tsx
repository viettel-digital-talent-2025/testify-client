"use client";
import { useAppSelector } from "@/shared/hooks";
import { Badge, Calendar, Card, Space, Tag, Tooltip, Typography } from "antd";
import type { CalendarProps } from "antd/es/calendar/generateCalendar";
import cronParser from "cron-parser";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCallback, useMemo, useState } from "react";
import { selectSchedules } from "../slices/sheduleSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ScheduleDate {
  id: string;
  name: string;
  type: "once" | "recurring";
  startTime: Dayjs;
  endTime: Dayjs;
  scenario: {
    name: string;
    type: string;
    flowType: string;
  };
}

type CalendarViewMode = "month" | "year";

export default function ScheduleCalendar() {
  const schedules = useAppSelector(selectSchedules);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const scheduleDates = useMemo(() => {
    const dates: ScheduleDate[] = [];

    schedules.forEach((schedule) => {
      const startTime = dayjs(schedule.timeStart);
      const endTime = dayjs(schedule.timeEnd);
      const timezone = schedule.timezone || "UTC";

      if (schedule.config?.type === "once") {
        dates.push({
          id: schedule.id,
          name: schedule.scenario.name,
          type: "once",
          startTime: startTime.tz(timezone),
          endTime: endTime.tz(timezone),
          scenario: schedule.scenario,
        });
      } else if (schedule.cronExpression) {
        try {
          const interval = cronParser.parseExpression(schedule.cronExpression, {
            currentDate: startTime.toDate(),
            endDate: endTime.toDate(),
            iterator: true,
            utc: false,
            tz: timezone,
          });

          while (interval.hasNext()) {
            const next = interval.next();
            const nextDate = dayjs(next.toDate());

            if (nextDate.isAfter(startTime) && nextDate.isBefore(endTime)) {
              dates.push({
                id: schedule.id,
                name: schedule.scenario.name,
                type: "recurring",
                startTime: nextDate,
                endTime: nextDate.add(schedule.scenario.duration, "second"),
                scenario: schedule.scenario,
              });
            }
          }
        } catch (err) {
          console.error("Error parsing cron expression:", err);
        }
      }
    });

    return dates;
  }, [schedules]);

  const getSchedulesForDate = useCallback(
    (date: Dayjs) => {
      return scheduleDates.filter(
        (schedule) =>
          schedule.startTime.isSame(date, "day") ||
          schedule.endTime.isSame(date, "day"),
      );
    },
    [scheduleDates],
  );

  const getSchedulesForMonth = useCallback(
    (date: Dayjs) => {
      return scheduleDates.filter(
        (schedule) =>
          schedule.startTime.isSame(date, "month") ||
          schedule.endTime.isSame(date, "month"),
      );
    },
    [scheduleDates],
  );

  const getScheduleTooltip = useCallback((schedule: ScheduleDate) => {
    return (
      <Space direction="vertical" size={2}>
        <Typography.Text strong>{schedule.name}</Typography.Text>
        <Space size={4}>
          <Tag color={schedule.type === "once" ? "blue" : "green"}>
            {schedule.type === "once" ? "One-time" : "Recurring"}
          </Tag>
          <Tag color="purple">{schedule.scenario.type}</Tag>
          <Tag color="orange">{schedule.scenario.flowType}</Tag>
        </Space>
        <Typography.Text type="secondary">
          Start: {schedule.startTime.format("HH:mm:ss")}
        </Typography.Text>
        <Typography.Text type="secondary">
          End: {schedule.endTime.format("HH:mm:ss")}
        </Typography.Text>
      </Space>
    );
  }, []);

  const dateCellRender = useCallback(
    (current: Dayjs) => {
      const schedulesOnDate = getSchedulesForDate(current);
      if (schedulesOnDate.length === 0) return null;

      return (
        <ul className="calendar-events">
          {schedulesOnDate.map((schedule) => (
            <li key={schedule.id}>
              <Tooltip title={getScheduleTooltip(schedule)}>
                <Badge
                  status={schedule.type === "once" ? "processing" : "success"}
                  text={
                    <Typography.Text ellipsis style={{ maxWidth: 100 }}>
                      {schedule.name}
                    </Typography.Text>
                  }
                />
              </Tooltip>
            </li>
          ))}
        </ul>
      );
    },
    [getSchedulesForDate, getScheduleTooltip],
  );

  const monthCellRender = useCallback(
    (current: Dayjs) => {
      const schedulesInMonth = getSchedulesForMonth(current);
      if (schedulesInMonth.length === 0) return null;

      const uniqueSchedules = Array.from(
        new Set(schedulesInMonth.map((s) => s.id)),
      ).map((id) => schedulesInMonth.find((s) => s.id === id)!);

      return (
        <div className="calendar-month-events">
          {uniqueSchedules.map((schedule) => (
            <Tooltip key={schedule.id} title={getScheduleTooltip(schedule)}>
              <Badge
                status={schedule.type === "once" ? "processing" : "success"}
                text={
                  <Typography.Text ellipsis style={{ maxWidth: 80 }}>
                    {schedule.name}
                  </Typography.Text>
                }
              />
            </Tooltip>
          ))}
        </div>
      );
    },
    [getSchedulesForMonth, getScheduleTooltip],
  );

  const cellRender: CalendarProps<Dayjs>["cellRender"] = useCallback(
    (current: Dayjs, info: { type: string; originNode: React.ReactNode }) => {
      if (info.type === "date") return dateCellRender(current);
      if (info.type === "month") return monthCellRender(current);
      return info.originNode;
    },
    [dateCellRender, monthCellRender],
  );

  const onPanelChange = useCallback((date: Dayjs, mode: CalendarViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <Card style={{ marginTop: 8 }}>
      <Calendar
        mode={viewMode}
        onPanelChange={onPanelChange}
        cellRender={cellRender}
        className="schedule-calendar"
      />
    </Card>
  );
}
