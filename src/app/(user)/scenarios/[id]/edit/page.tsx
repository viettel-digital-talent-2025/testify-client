"use client";
import { useGetScenarioQuery } from "@/scenarios/apis/scenarioApi";
import {
  ScenarioConfigCard,
  ScenarioDetailsCard,
} from "@/scenarios/components/create";
import {
  DeleteScenarioButton,
  UpdateScenarioButton,
} from "@/scenarios/components/edit";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";
import { getScenarioStrategy } from "@/scenarios/strategies";
import { PageTitle, PageTitleLayout } from "@/shared/components/pages";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
dayjs.extend(duration);

export default function EditScenarioPage() {
  const { id } = useParams();
  const { form, setStrategy, setIsEditing } = useScenarioFormContext();
  const { data: scenario } = useGetScenarioQuery(id as string, {
    skip: !id,
  });

  useEffect(() => {
    setIsEditing(true);
    if (scenario) {
      const strategy = getScenarioStrategy(scenario.type);
      setStrategy(strategy);

      const formScenario = {
        ...scenario,
        duration: dayjs()
          .set("minutes", 0)
          .set("hours", 0)
          .set("seconds", scenario.duration),
        flows: scenario.flows.map((flow) => ({
          ...flow,
          steps: flow.steps.map((step) => ({
            ...step,
            config: strategy.formatForm(step.config),
          })),
        })),
      };

      form.setFieldsValue(formScenario);
    }
  }, [form, scenario, setIsEditing, setStrategy]);

  return (
    <div className="flex h-full flex-col gap-2">
      <PageTitleLayout>
        <PageTitle
          title="Edit Test Scenario"
          description="Edit the performance testing scenario. You can configure endpoints, virtual users, and duration."
        />
        <Space>
          <Link href="/scenarios">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
          <DeleteScenarioButton id={id as string} />
          <UpdateScenarioButton id={id as string} />
        </Space>
      </PageTitleLayout>

      <Row
        gutter={16}
        style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
      >
        <Col span={10}>
          <ScenarioDetailsCard />
        </Col>
        <Col span={14}>
          <ScenarioConfigCard />
        </Col>
      </Row>
    </div>
  );
}
