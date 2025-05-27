"use client";
import { List } from "antd";
import { useGetScenariosByGroupQuery } from "../apis/scenarioApi";
import { useAppSelector } from "@/shared/hooks";
import { selectSelectedGroupId } from "../slices/scenariosSlice";
import { ScenarioCard } from "./group";

export default function ScenariosList() {
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const { data: scenarios, isLoading } =
    useGetScenariosByGroupQuery(selectedGroupId);

  return (
    <List
      loading={isLoading}
      style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
      dataSource={scenarios}
      renderItem={(scenario) => (
        <List.Item>
          <ScenarioCard scenario={scenario} />
        </List.Item>
      )}
      locale={{
        emptyText: (
          <div className="py-8 text-center">
            <p className="text-gray-500">No scenarios found</p>
          </div>
        ),
      }}
    />
  );
}
