import { ScenariosList } from "@/scenarios/components";
import { PageTitle } from "@/shared/components/pages";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

export default function ScenariosPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <PageTitle
          title="Test Scenarios"
          description="Create and manage your test scenarios"
        />
        <Link href="/scenarios/create">
          <Button type="primary" icon={<PlusOutlined />}>
            New Scenario
          </Button>
        </Link>
      </div>
      <ScenariosList />
    </div>
  );
}
