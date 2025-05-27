"use client";
import { Form, Input } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

export default function UrlInput({
  name = ["config", "url"],
  initialValues,
}: {
  name?: string | (string | number)[];
  initialValues?: string;
}) {
  return (
    <Form.Item
      name={name}
      label="Web Page URL"
      rules={[{ required: true, message: "Please enter web page URL" }]}
      extra="Enter the URL of the web page to load test. The page will be loaded and rendered."
      initialValue={initialValues}
    >
      <Input
        placeholder="https://example.com/page"
        prefix={<GlobalOutlined />}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
}
