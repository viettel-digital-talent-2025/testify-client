"use client";

import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from "@/schedule/apis/scheduleApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  selectIsModalOpen,
  selectSchedule,
  setIsModalOpen,
  setSchedule,
} from "../slices/sheduleSlice";

export default function useSchedule() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const isModalOpen = useAppSelector(selectIsModalOpen);
  const schedule = useAppSelector(selectSchedule);

  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();

  useEffect(() => {
    if (schedule) {
      form.setFieldsValue({
        scenarioId: schedule.scenario.id,
        timezone: schedule.timezone,
        timeStart: schedule?.timeStart ?? dayjs(schedule.timeStart),
        timeEnd: schedule.timeEnd ?? dayjs(schedule.timeEnd),
        config: {
          type: schedule.config?.type,
          time: schedule.config?.time ? dayjs(schedule.config.time) : undefined,
          day: schedule.config?.day,
          hours: schedule.config?.hours,
          date: schedule.config?.date ? dayjs(schedule.config.date) : undefined,
        },
      });
    } else {
      form.resetFields();
    }
  }, [form, schedule]);

  const handleModalOk = async () => {
    const values = await form.validateFields();
    if (form.getFieldsError().some((field) => field.errors.length > 0)) {
      return;
    }

    const { scenarioId, timezone, timeStart, timeEnd, config } = values;

    if (!schedule) {
      await createSchedule({
        scenarioId,
        timezone,
        timeStart,
        timeEnd:
          config.type === "once"
            ? dayjs(config.date).add(10, "seconds")
            : timeEnd,
        config: {
          type: config.type,
          time: config.time ? dayjs(config.time).toISOString() : undefined,
          day: config.day,
          hours: config.hours,
          date: config.date ? dayjs(config.date).toISOString() : undefined,
        },
      }).unwrap();
    } else {
      await updateSchedule({
        id: schedule.id,
        ...values,
      }).unwrap();
      dispatch(setSchedule(null));
    }
    dispatch(setIsModalOpen(false));
    form.resetFields();
  };

  const handleModalCancel = () => {
    dispatch(setIsModalOpen(false));
    form.resetFields();
  };

  return {
    form,
    onOk: handleModalOk,
    onCancel: handleModalCancel,
    isModalOpen,
  };
}
