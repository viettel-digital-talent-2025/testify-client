"use client";
import { useAppDispatch } from "@/shared/hooks";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FieldTimeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  CardProps,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import cronParser from "cron-parser";
import cronstrue from "cronstrue";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
} from "../apis/scheduleApi";
import {
  setIsModalOpen,
  setSchedule,
  setSchedules,
} from "../slices/sheduleSlice";
import { Schedule } from "../types/schedule";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => Promise<void>;
}

const ScheduleCard = memo(
  ({ schedule, onEdit, onDelete }: ScheduleCardProps) => {
    const getDropdownItems = useCallback(
      (): MenuProps["items"] => [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Edit",
          onClick: () => onEdit(schedule),
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: (
            <Popconfirm
              title="Delete this schedule?"
              description="Are you sure you want to delete this scheduled test?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(schedule.id)}
            >
              Delete
            </Popconfirm>
          ),
          danger: true,
        },
      ],
      [schedule, onEdit, onDelete],
    );

    const getHumanReadableCron = useCallback((cronExpression: string) => {
      try {
        return cronstrue.toString(cronExpression);
      } catch {
        return cronExpression;
      }
    }, []);

    const formatDate = useCallback((date: string, timezone?: string) => {
      return dayjs(date)
        .tz(timezone || "UTC")
        .format("HH:mm:ss DD/MM/YYYY");
    }, []);

    const getNextScheduleTime = useCallback(() => {
      if (!schedule.cronExpression) return null;

      try {
        const interval = cronParser.parseExpression(schedule.cronExpression, {
          currentDate: new Date(),
          iterator: true,
          utc: false,
          tz: schedule.timezone || "UTC",
        });

        const next = interval.next();
        return dayjs(next.toDate());
      } catch {
        return null;
      }
    }, [schedule.cronExpression, schedule.timezone]);

    const getTimeRemaining = useCallback(() => {
      const nextTime = getNextScheduleTime();
      if (!nextTime) return null;

      const now = dayjs();
      const diff = nextTime.diff(now);

      if (diff <= 0) return "Đang chạy";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (days > 0) parts.push(`${days} ngày`);
      if (hours > 0) parts.push(`${hours} giờ`);
      if (minutes > 0) parts.push(`${minutes} phút`);
      if (seconds > 0) parts.push(`${seconds} giây`);

      return parts.join(" ") + " nữa";
    }, [getNextScheduleTime]);

    const timeRemaining = useMemo(() => getTimeRemaining(), [getTimeRemaining]);

    return (
      <Card
        key={schedule.id}
        title={
          <Space>
            <Typography.Text strong style={{ fontSize: "16px" }}>
              {schedule.scenario.name}
            </Typography.Text>
            <Tag color={schedule.isActive ? "success" : "default"}>
              {schedule.isActive ? "Active" : "Inactive"}
            </Tag>
          </Space>
        }
        extra={
          <Dropdown
            menu={{ items: getDropdownItems() }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        }
      >
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
            {schedule.cronExpression && (
              <>
                <Tooltip title={schedule.cronExpression}>
                  <Tag color="orange">
                    {getHumanReadableCron(schedule.cronExpression)}
                  </Tag>
                </Tooltip>
                {timeRemaining && <Tag color="blue">{timeRemaining}</Tag>}
              </>
            )}

            <Space>
              <ClockCircleOutlined />
              <Typography.Text>
                Start:{" "}
                {schedule?.timeStart
                  ? formatDate(schedule?.timeStart, schedule.timezone)
                  : "N/A"}
              </Typography.Text>
            </Space>
            <Space>
              <FieldTimeOutlined />
              <Typography.Text>
                End:{" "}
                {schedule?.timeEnd
                  ? formatDate(schedule?.timeEnd, schedule.timezone)
                  : "N/A"}
              </Typography.Text>
            </Space>

            <Space>
              <Typography.Text type="secondary">
                Timezone: {schedule.timezone}
              </Typography.Text>
            </Space>
          </Space>
        </Space>
      </Card>
    );
  },
);

ScheduleCard.displayName = "ScheduleCard";

export default function UpcomingTests() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetSchedulesQuery();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const onSchedule = useCallback(() => {
    dispatch(setIsModalOpen(true));
  }, [dispatch]);

  const onEdit = useCallback(
    (schedule: Schedule) => {
      dispatch(setIsModalOpen(true));
      dispatch(setSchedule(schedule));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    async (id: string) => {
      await deleteSchedule(id);
    },
    [deleteSchedule],
  );

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

  const schedules = useMemo(() => data?.schedulers || [], [data?.schedulers]);

  useEffect(() => {
    if (schedules.length > 0) {
      dispatch(setSchedules(schedules));
    }
  }, [dispatch, schedules]);

  return (
    <Card
      {...cardStyles}
      title="Upcoming Tests"
      extra={
        <Button type="primary" onClick={onSchedule}>
          Schedule
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <Card loading={true} />
        ) : (
          schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </Card>
  );
}
