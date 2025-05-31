"use client";
import { Card, Space } from "antd";
import Title from "antd/es/typography/Title";
import {
  RunComparisonModal,
  RunDetailModal,
  RunHistoryFilters,
  RunHistoryTable,
} from "./run-history";

export default function RunHistory() {
  return (
    <>
      {/* Run History Card */}
      <Card
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Title level={3} style={{ margin: 0 }}>
              Run History
            </Title>
            <RunHistoryFilters />
          </Space>
        }
      >
        <RunHistoryTable />
      </Card>

      {/* Modals */}
      <RunDetailModal />
      <RunComparisonModal />
    </>
  );
}
