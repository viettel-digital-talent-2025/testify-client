"use client";
import { useCallback } from "react";
import {
  Modal,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  Descriptions,
  Progress,
} from "antd";
import {
  getRunHistoryStatusColor,
  getRunHistoryStatusIcon,
} from "@/scenarios/components/utils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  selectSelectedRun,
  setIsDetailModalVisible,
  selectIsDetailModalVisible,
} from "@/scenarios/slices/runHistoriesSlice";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";

export default function RunDetailModal() {
  const dispatch = useAppDispatch();
  const run = useAppSelector(selectSelectedRun);
  const open = useAppSelector(selectIsDetailModalVisible);

  const onCancel = useCallback(() => {
    dispatch(setIsDetailModalVisible(false));
  }, [dispatch]);

  if (!run) return null;

  return (
    <Modal
      title="Run Details"
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={null}
      destroyOnHidden
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Status"
                value={run.status}
                valueStyle={{ color: getRunHistoryStatusColor(run.status) }}
                prefix={getRunHistoryStatusIcon(run.status)}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Duration"
                value={run.duration}
                suffix="seconds"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Virtual Users" value={run.vus} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Performance Metrics">
              <Descriptions column={1}>
                <Descriptions.Item label="Average Response Time">
                  {run.avgResponseTime.toFixed(2)}ms
                </Descriptions.Item>
                <Descriptions.Item label="Requests Per Second">
                  {run.requestsPerSecond.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Success Rate">
                  <Progress
                    percent={run.successRate * 100}
                    status={
                      run.successRate > 0.9
                        ? "success"
                        : run.successRate > 0.7
                          ? "normal"
                          : "exception"
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Error Rate">
                  <Progress percent={run.errorRate * 100} status="exception" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Run Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Run ID">
                  <Text copyable>{run.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Started At">
                  {dayjs(run.runAt).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {dayjs(run.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {dayjs(run.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
}
