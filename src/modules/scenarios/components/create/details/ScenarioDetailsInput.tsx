"use client";
import { useGetScenarioGroupsQuery } from "@/scenarios/apis/scenarioGroupApi";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { ScenarioFlowType, ScenarioType } from "@/scenarios/types/scenario";
import { getScenarioIconByType } from "@/scenarios/utils";
import { BranchesOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, TimePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useCallback } from "react";
import { ScenarioFlowCard, ScenarioTypeCard } from ".";

const scenarioTypes = [
  {
    label: "Website",
    value: ScenarioType.WEB,
    icon: getScenarioIconByType({ type: ScenarioType.WEB, size: "medium" }),
  },
  {
    label: "API",
    value: ScenarioType.API,
    icon: getScenarioIconByType({ type: ScenarioType.API, size: "medium" }),
  },
  // {
  //   label: "Database",
  //   value: ScenarioType.DATABASE,
  //   icon: getScenarioIconByType({ type: ScenarioType.DATABASE }),
  // },
  // {
  //   label: "User Flow",
  //   value: ScenarioType.USER_FLOW,
  //   icon: getScenarioIconByType({ type: ScenarioType.USER_FLOW }),
  // },
];

export const NameInput = () => {
  return (
    <Form.Item
      name="name"
      label="Name"
      rules={[{ required: true, message: "Please enter a name" }]}
    >
      <Input placeholder="API Load Test" />
    </Form.Item>
  );
};

export const DescriptionInput = () => {
  return (
    <Form.Item name="description" label="Description">
      <TextArea rows={2} placeholder="Test description..." />
    </Form.Item>
  );
};

export const VusInput = () => {
  return (
    <Form.Item
      name="vus"
      label="Virtual Users"
      extra="Number of concurrent users"
      initialValue={60}
      rules={[
        {
          required: true,
          message: "Please enter number of virtual users",
        },
        {
          validator: (_, value) => {
            if (value && value < 1) {
              return Promise.reject(
                new Error("Number of virtual users must be greater than 0"),
              );
            }
            return Promise.resolve();
          },
        },
      ]}
    >
      <InputNumber min={1} placeholder="500" style={{ width: "100%" }} />
    </Form.Item>
  );
};

export const DurationInput = () => {
  return (
    <Form.Item
      name="duration"
      label="Duration"
      extra="Format: 10m, 1h, etc."
      initialValue={dayjs("00:01:00", "HH:mm:ss")}
      rules={[
        {
          required: true,
          message: "Please enter duration",
        },
      ]}
    >
      <TimePicker allowClear style={{ width: "100%" }} />
    </Form.Item>
  );
};

export const GroupInput = () => {
  const { data, isLoading } = useGetScenarioGroupsQuery();

  return (
    <Form.Item
      name="groupId"
      label="Group"
      extra="Organize scenarios by group"
      initialValue={"null"}
    >
      <Select placeholder="Select Group" loading={isLoading} allowClear>
        <Select.Option value={"null"}>No Group</Select.Option>
        {data?.scenarioGroups?.map((group) => (
          <Select.Option key={group.id} value={group.id}>
            {group.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export const ScenarioTypeInput = () => {
  const { form } = useScenarioFormContext();
  const type = Form.useWatch("type", form);

  const onClick = useCallback(
    async (value: ScenarioType) => {
      form.setFieldsValue({ type: value });
      if (value === ScenarioType.USER_FLOW) {
        form.setFieldsValue({ flowType: ScenarioFlowType.MULTI });
      }
    },
    [form],
  );

  return (
    <Form.Item
      name="type"
      label="Type"
      initialValue={ScenarioType.WEB}
      required
    >
      <Row gutter={16}>
        {scenarioTypes.map(({ label, value, icon }) => (
          <Col span={6} key={value}>
            <ScenarioTypeCard
              icon={icon}
              label={label}
              isSelected={type === value}
              onClick={() => onClick(value)}
            />
          </Col>
        ))}
      </Row>
    </Form.Item>
  );
};

export const ScenarioFlowInput = () => {
  const { form } = useScenarioFormContext();
  const type = Form.useWatch("type", form);
  const flow = Form.useWatch("flowType", form);

  return (
    <Form.Item
      label="Flow"
      name="flowType"
      required
      initialValue={ScenarioFlowType.SIMPLE}
      style={{ margin: 0 }}
    >
      <Row gutter={16}>
        {type !== ScenarioType.USER_FLOW && (
          <>
            <Col span={12}>
              <ScenarioFlowCard
                icon={<PlusCircleOutlined />}
                title="Simple Scenario"
                description="Single endpoint or simple flow"
                isSelected={flow === ScenarioFlowType.SIMPLE}
                onClick={() =>
                  form.setFieldsValue({ flowType: ScenarioFlowType.SIMPLE })
                }
              />
            </Col>
          </>
        )}
        <Col span={12}>
          <ScenarioFlowCard
            icon={<BranchesOutlined />}
            title="Multi-Flow Scenario"
            description="Complex user journeys with multiple paths"
            isSelected={flow === ScenarioFlowType.MULTI}
            onClick={() =>
              form.setFieldsValue({ flowType: ScenarioFlowType.MULTI })
            }
          />
        </Col>
      </Row>
    </Form.Item>
  );
};
