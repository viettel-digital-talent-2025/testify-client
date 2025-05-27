"use client";
import { Form, Input, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FormLabel } from "@/shared/components/forms";
import TextArea from "antd/es/input/TextArea";

export default function UserFlowConfigForm() {
  return (
    <>
      <Col span={12}>
        <Form.Item
          name="stepName"
          label={<FormLabel label="Step Name" />}
          rules={[{ required: true, message: "Please enter step name" }]}
        >
          <Input placeholder="Login to Dashboard" prefix={<UserOutlined />} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="actionDescription"
          label={<FormLabel label="Action Description" />}
          rules={[
            { required: true, message: "Please enter action description" },
          ]}
        >
          <TextArea
            placeholder="Enter username and password, then click login button"
            rows={3}
          />
        </Form.Item>
      </Col>
    </>
  );
}
