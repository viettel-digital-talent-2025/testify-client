import { Button, Badge, Dropdown } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ScenarioGroup } from "@/scenarios/types/scenarioGroup";

interface GroupListItemProps {
  item: ScenarioGroup;
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onEditGroup?: (group: ScenarioGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
}

export default function GroupListItem({
  item,
  selectedGroupId,
  onSelectGroup,
  onEditGroup,
  onDeleteGroup,
}: GroupListItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="grow">
        <Button
          block
          type={selectedGroupId === item.id ? "primary" : "text"}
          onClick={() => onSelectGroup(item.id)}
          style={{ justifyContent: "flex-start" }}
        >
          <div className="flex items-center gap-2">
            <Badge
              count={item.scenarios.length}
              style={{ backgroundColor: "#f0f0f0", color: "#666" }}
            />
            <span className="flex-1 truncate">{item.name}</span>
          </div>
        </Button>
      </div>

      {onEditGroup && onDeleteGroup && (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit Group",
                icon: <EditOutlined />,
                onClick: () =>
                  onEditGroup({
                    id: item.id!,
                    name: item.name,
                    description: "",
                    scenarios: item.scenarios,
                  }),
              },
              {
                key: "delete",
                label: "Delete Group",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => onDeleteGroup(item.id!),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      )}
    </div>
  );
}
