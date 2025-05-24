"use client";
import { Input, Row, Col, InputNumber, TimePicker, Select, Form } from "antd";
import { PlusCircleOutlined, BranchesOutlined } from "@ant-design/icons";
import {
  useAppDispatch,
  useAppSelector,
} from "@/modules/shared/hooks/useStore";
import {
  // set
  setType,
  setFlow,
  // select
  selectType,
  selectFlow,
  // types
} from "@/modules/scenarios/slices/createScenarioSlice";
import { ScenarioTypeCard, ScenarioFlowCard } from ".";
import TextArea from "antd/es/input/TextArea";
import {
  GlobalOutlined,
  ApiOutlined,
  DatabaseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  ScenarioType,
  ScenarioFlowType,
} from "@/modules/scenarios/types/scenario";
import { useGetScenarioGroupsQuery } from "@/modules/scenarios/apis/scenarioGroupApi";
import dayjs from "dayjs";

const scenarioTypes = [
  {
    label: "Website",
    value: ScenarioType.WEB,
    icon: <GlobalOutlined />,
  },
  {
    label: "API",
    value: ScenarioType.API,
    icon: <ApiOutlined />,
  },
  {
    label: "Database",
    value: ScenarioType.DATABASE,
    icon: <DatabaseOutlined />,
  },
  {
    label: "User Flow",
    value: ScenarioType.USER_FLOW,
    icon: <UserOutlined />,
  },
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
      initialValue={""}
    >
      <Select placeholder="Select Group" loading={isLoading} allowClear>
        <Select.Option value="">No Group</Select.Option>
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
  const dispatch = useAppDispatch();
  const type = useAppSelector(selectType);

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
              onClick={
                type === ScenarioType.USER_FLOW
                  ? () => {
                      dispatch(setFlow(ScenarioFlowType.MULTI));
                      dispatch(setType(value));
                    }
                  : () => dispatch(setType(value))
              }
            />
          </Col>
        ))}
      </Row>
    </Form.Item>
  );
};

export const ScenarioFlowInput = () => {
  const dispatch = useAppDispatch();
  const type = useAppSelector(selectType);
  const flow = useAppSelector(selectFlow);

  return (
    <Form.Item name="type" label="Flow" required style={{ margin: 0 }}>
      <Row gutter={16}>
        {type !== ScenarioType.USER_FLOW && (
          <>
            <Col span={12}>
              <ScenarioFlowCard
                icon={<PlusCircleOutlined />}
                title="Simple Scenario"
                description="Single endpoint or simple flow"
                isSelected={flow === ScenarioFlowType.SIMPLE}
                onClick={() => dispatch(setFlow(ScenarioFlowType.SIMPLE))}
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
            onClick={() => dispatch(setFlow(ScenarioFlowType.MULTI))}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};
