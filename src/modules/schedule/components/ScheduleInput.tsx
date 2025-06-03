"use client";
import { useGetScenarioGroupsQuery } from "@/scenarios/apis/scenarioGroupApi";
import { ScenarioGroup } from "@/scenarios/types/scenarioGroup";
import { getScenarioIconByType } from "@/scenarios/utils";
import {
  DatePicker,
  Form,
  InputNumber,
  Select,
  Space,
  TimePicker,
  TreeSelect,
} from "antd";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { useMemo } from "react";

export const ScenarioSelectInput = () => {
  const { data: scenarioGroupsData, isLoading } = useGetScenarioGroupsQuery();

  const treeData = useMemo(() => {
    if (!scenarioGroupsData) return [];

    const mergedGroups: ScenarioGroup[] = [
      {
        id: "null",
        name: "No Group",
        description: "",
        scenarios:
          scenarioGroupsData.scenarios?.map((scenario) => ({
            id: scenario.id,
            name: scenario.name,
            type: scenario.type,
          })) || [],
      },
      ...(scenarioGroupsData.scenarioGroups || []),
    ];

    return mergedGroups.map((group) => ({
      key: `group-${group.id}`,
      title: group.name,
      value: `group-${group.id}`,
      selectable: false,
      children: group.scenarios.map((scenario) => ({
        key: scenario.id,
        title: (
          <Space>
            {getScenarioIconByType({ type: scenario.type })}
            {scenario.name}
          </Space>
        ),
        value: scenario.id,
      })),
    }));
  }, [scenarioGroupsData]);

  return (
    <Form.Item
      name="scenarioId"
      label="Select Scenario"
      rules={[{ required: true, message: "Please select a scenario" }]}
    >
      <TreeSelect
        showSearch
        allowClear
        loading={isLoading}
        treeData={treeData}
        treeDefaultExpandAll
        placeholder="Select a scenario"
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};

export const TimezoneSelectInput = () => {
  return (
    <Form.Item
      name="timezone"
      label="Timezone"
      initialValue={moment.tz.guess()}
      rules={[{ required: true, message: "Please select a timezone" }]}
    >
      <Select showSearch>
        {moment.tz.names().map((tz) => (
          <Select.Option key={tz} value={tz}>
            {tz}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export const TimeStartInput = () => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.config.type !== currentValues.config.type
      }
    >
      {({ getFieldValue, setFieldsValue }) => {
        const type = getFieldValue(["config", "type"]);
        if (type === "once") {
          setFieldsValue({ timeStart: undefined });
          return null;
        }
        return (
          <Form.Item name="timeStart" label="Time start" initialValue={dayjs()}>
            <DatePicker
              showTime
              showHour
              showMinute
              placeholder="Time start"
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export const TimeEndInput = () => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.config.type !== currentValues.config.type
      }
    >
      {({ getFieldValue, setFieldsValue }) => {
        const timeStart = getFieldValue("timeStart");
        const type = getFieldValue(["config", "type"]);
        if (type === "once") {
          setFieldsValue({ timeEnd: undefined });
          return null;
        }
        return (
          <Form.Item
            label="Time end"
            name="timeEnd"
            style={{ width: "100%" }}
            rules={[
              {
                validator: (_rule, value, callback) => {
                  if (timeStart && value && dayjs(value).isBefore(timeStart)) {
                    callback("Time end must be after time start");
                  }
                  callback();
                },
              },
            ]}
          >
            <DatePicker
              showTime
              showHour
              showMinute
              needConfirm
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export const CronOptionInput = () => {
  return (
    <Form.Item
      name={["config", "type"]}
      label="Run test on"
      initialValue="every_day"
      style={{ marginBottom: 8 }}
    >
      <Select>
        <Select.Option value="every_day">Every day at [hh:mm]</Select.Option>
        <Select.Option value="every_x_hours">Every [X] hours</Select.Option>
        <Select.Option value="every_weekday">
          Every weekday at [hh:mm]
        </Select.Option>
        <Select.Option value="every_weekend">
          Every weekend at [hh:mm]
        </Select.Option>
        <Select.Option value="every_monday">
          Every Monday at [hh:mm]
        </Select.Option>
        <Select.Option value="monthly_day">
          Monthly on day [D] at [hh:mm]
        </Select.Option>
        <Select.Option value="once">Run once at [datetime]</Select.Option>
      </Select>
    </Form.Item>
  );
};

export const CronConfigInput = () => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.config.type !== currentValues.config.type
      }
    >
      {({ getFieldValue }) => {
        const type = getFieldValue(["config", "type"]);
        switch (type) {
          case "every_day":
            return (
              <Form.Item
                label="Time"
                name={["config", "time"]}
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Time"
                />
              </Form.Item>
            );
          case "every_x_hours":
            return (
              <Form.Item
                label="Hours"
                name={["config", "hours"]}
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <InputNumber
                  min={0}
                  max={23}
                  style={{ width: "100%" }}
                  placeholder="Hours (0-23)"
                />
              </Form.Item>
            );
          case "every_weekday":
            return (
              <Form.Item
                label="Time"
                name={["config", "time"]}
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Time"
                />
              </Form.Item>
            );
          case "every_weekend":
            return (
              <Form.Item
                label="Time"
                name={["config", "time"]}
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Time"
                />
              </Form.Item>
            );
          case "every_monday":
            return (
              <Form.Item
                label="Time"
                name={["config", "time"]}
                rules={[{ required: true, message: "Please select a time" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Time"
                />
              </Form.Item>
            );
          case "monthly_day":
            return (
              <Form.Item noStyle>
                <Space.Compact>
                  <Form.Item label="Day" name={["config", "day"]}>
                    <InputNumber
                      min={1}
                      max={31}
                      placeholder="Day (1-31)"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Time"
                    name={["config", "time"]}
                    rules={[
                      { required: true, message: "Please select a time" },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      showHour
                      showMinute
                      needConfirm
                      placeholder="Time"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            );
          case "once":
            return (
              <Form.Item
                label="Date"
                name={["config", "date"]}
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  showTime
                  showHour
                  showMinute
                  placeholder="Date"
                  needConfirm
                  style={{ width: "100%" }}
                />
              </Form.Item>
            );
          default:
            return null;
        }
      }}
    </Form.Item>
  );
};
