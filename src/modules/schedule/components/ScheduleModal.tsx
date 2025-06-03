"use client";
import useSchedule from "@/schedule/hooks/useSchedule";
import { useAppSelector } from "@/shared/hooks";
import { Col, Form, Modal, Row } from "antd";
import { selectSchedule } from "../slices/sheduleSlice";
import {
  CronConfigInput,
  CronOptionInput,
  ScenarioSelectInput,
  TimeEndInput,
  TimeStartInput,
  TimezoneSelectInput,
} from "./ScheduleInput";

export default function ScheduleModal() {
  const { form, onOk, onCancel, isModalOpen } = useSchedule();
  const schedule = useAppSelector(selectSchedule);

  return (
    <Modal
      title={schedule ? "Edit Schedule" : "Schedule Test"}
      open={isModalOpen}
      onOk={onOk}
      okText={schedule ? "Save Changes" : "Schedule"}
      onCancel={onCancel}
      cancelText="Cancel"
      maskClosable={false}
    >
      <Form form={form} name="schedule-create" layout="vertical">
        <Row gutter={12}>
          <Col span={12}>
            <ScenarioSelectInput />
          </Col>
          <Col span={12}>
            <TimezoneSelectInput />
          </Col>
          <Col span={12}>
            <CronOptionInput />
          </Col>
          <Col span={12}>
            <CronConfigInput />
          </Col>
          <Col span={12}>
            <TimeStartInput />
          </Col>
          <Col span={12}>
            <TimeEndInput />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
