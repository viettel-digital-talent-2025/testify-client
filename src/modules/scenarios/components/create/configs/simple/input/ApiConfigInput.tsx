"use client";
import { Form, Input, Select, Button, Radio } from "antd";
import {
  ApiOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { BodyType, HttpMethod } from "@/modules/scenarios/types/config";
import { useCallback } from "react";
import TextArea from "antd/es/input/TextArea";

export const EndpointInput = () => {
  return (
    <Form.Item
      name={["config", "endpoint"]}
      label="API Endpoint"
      rules={[{ required: true, message: "Please enter API endpoint" }]}
    >
      <Input
        placeholder="https://api.example.com/endpoint"
        prefix={<ApiOutlined />}
      />
    </Form.Item>
  );
};

export const MethodSelect = () => {
  return (
    <Form.Item
      name={["config", "method"]}
      label="HTTP Method"
      rules={[{ required: true, message: "Please select HTTP method" }]}
      initialValue={HttpMethod.GET}
    >
      <Select placeholder="Select HTTP method">
        {Object.values(HttpMethod).map((method) => (
          <Select.Option key={method} value={method}>
            {method}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export const HeadersInput = () => {
  return (
    <Form.Item label="Headers (Optional)">
      <Form.List name={["config", "headers"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-2"
              >
                <Form.Item
                  {...restField}
                  name={[name, "key"]}
                  rules={[{ required: true, message: "Missing header key" }]}
                  style={{ flex: 2, marginBottom: 8 }}
                >
                  <Input placeholder="Header Key" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "value"]}
                  rules={[{ required: true, message: "Missing header value" }]}
                  style={{ flex: 3, marginBottom: 8 }}
                >
                  <Input placeholder="Header Value" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </div>
            ))}
            <Form.Item style={{ marginBottom: 8 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export const BodyTypeInput = () => {
  return (
    <Form.Item
      name={["config", "bodyType"]}
      label="Request Body (Optional)"
      initialValue={BodyType.NONE}
      style={{ marginBottom: 8 }}
    >
      <Radio.Group>
        <Radio value={BodyType.NONE}>None</Radio>
        <Radio value={BodyType.JSON}>JSON</Radio>
        <Radio value={BodyType.TEXT}>Text</Radio>
        <Radio value={BodyType.RAW}>Raw</Radio>
        <Radio value={BodyType.FORM_DATA}>Form Data</Radio>
        <Radio value={BodyType.URLENCODED}>x-www-form-urlencoded</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export const PayloadInput = () => {
  const renderTextArea = (bodyType: BodyType) => {
    let placeholder = "";
    switch (bodyType) {
      case BodyType.JSON:
        placeholder = '{"key": "value"}';
        break;
      case BodyType.TEXT:
        placeholder = "Plain text content";
        break;
      case BodyType.RAW:
        placeholder = "Raw body content...";
        break;
    }

    return (
      <Form.Item name={["config", "payload"]}>
        <TextArea placeholder={placeholder} rows={4} />
      </Form.Item>
    );
  };

  const renderKeyValuePairs = useCallback(() => {
    return (
      <Form.Item style={{ margin: 0 }}>
        <Form.List name={["config", "payload"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="flex items-baseline justify-between gap-2"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    rules={[{ required: true, message: "Missing header key" }]}
                    style={{ flex: 2, marginBottom: 8 }}
                  >
                    <Input placeholder="Header Key" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[
                      { required: true, message: "Missing header value" },
                    ]}
                    style={{ flex: 3, marginBottom: 8 }}
                  >
                    <Input placeholder="Header Value" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item style={{ marginBottom: 8 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }, []);

  return (
    <Form.Item
      style={{ margin: 0 }}
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.config.bodyType !== currentValues.config.bodyType
      }
    >
      {({ getFieldValue }) => {
        const fieldAValue = getFieldValue(["config", "bodyType"]);
        switch (fieldAValue) {
          case BodyType.JSON:
          case BodyType.TEXT:
          case BodyType.RAW:
            return renderTextArea(fieldAValue);
          case BodyType.FORM_DATA:
          case BodyType.URLENCODED:
            return renderKeyValuePairs();
          default:
            return "";
        }
      }}
    </Form.Item>
  );
};
