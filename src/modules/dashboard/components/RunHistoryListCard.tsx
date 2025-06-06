"use client";
import { RunHistory } from "@/scenarios/types/runHistory";
import { Card, Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { formatDistanceToNow } from "date-fns";
import RunHistoryCard from "./RunHistoryCard";

interface RunHistoryListCardProps {
  title: string;
  data: RunHistory[] | undefined;
  emptyText: string;
}

export default function RunHistoryListCard(props: RunHistoryListCardProps) {
  const { title, data, emptyText } = props;
  const hasData = data && data.length > 0;
  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex items-center justify-between">
          <div className="">
            <Title level={4} style={{ marginBottom: 0 }}>
              {title}
            </Title>
            <Text type="secondary">
              Last updated: {formatDistanceToNow(new Date())}
            </Text>
          </div>
        </div>
        {!hasData ? (
          <Paragraph
            type="secondary"
            style={{ textAlign: "center", margin: 0 }}
          >
            {emptyText}
          </Paragraph>
        ) : (
          <>
            {data?.map((history) => (
              <RunHistoryCard key={history.id} history={history} />
            ))}
          </>
        )}
      </Space>
    </Card>
  );
}
