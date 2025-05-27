"use client";
import { Form, Select, Col } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { FormLabel } from "@/shared/components/forms";
import TextArea from "antd/es/input/TextArea";

export const databaseTypes = [
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
] as const;

export default function DatabaseConfigForm() {
  return (
    <>
      <Col span={12}>
        <Form.Item
          name="databaseType"
          label={<FormLabel label="Database Type" />}
          rules={[{ required: true, message: "Please select database type" }]}
        >
          <Select
            options={[...databaseTypes]}
            suffixIcon={<DatabaseOutlined />}
            placeholder="Select database type"
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="query"
          label={<FormLabel label="Query" />}
          rules={[{ required: true, message: "Please enter database query" }]}
        >
          <TextArea
            placeholder="SELECT * FROM users WHERE status = 'active'"
            rows={3}
          />
        </Form.Item>
      </Col>
    </>
  );
}
