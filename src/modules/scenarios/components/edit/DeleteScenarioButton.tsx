"use client";
import { useDeleteScenarioMutation } from "@/scenarios/apis/scenarioApi";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function DeleteScenarioButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleteScenario, { isLoading }] = useDeleteScenarioMutation();

  const onConfirm = useCallback(async () => {
    await deleteScenario(id);
    router.push("/scenarios");
  }, [deleteScenario, id, router]);

  return (
    <Popconfirm
      title="Are you sure you want to delete this scenario?"
      onConfirm={onConfirm}
    >
      <Button danger icon={<DeleteOutlined />} loading={isLoading}>
        Delete
      </Button>
    </Popconfirm>
  );
}
