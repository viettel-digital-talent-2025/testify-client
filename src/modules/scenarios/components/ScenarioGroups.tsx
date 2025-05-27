"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Tree, TreeDataNode, TreeProps, Tooltip } from "antd";
import {
  PlusOutlined,
  GroupOutlined,
  DownOutlined,
  FileOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import { GroupModal } from "./group";
import { useScenarioGroups } from "../hooks/useScenarioGroups";
import { useAppDispatch } from "@/shared/hooks/useStore";
import {
  setSelectedGroupId,
  setSelectedScenarioId,
} from "@/scenarios/slices/scenariosSlice";
import { ScenarioGroup } from "../types/scenarioGroup";
import { EventDataNode } from "antd/es/tree";
import { getScenarioIconByType } from "./utils";
import Title from "antd/es/typography/Title";
import "./ScenarioGroups.css";

const { DirectoryTree } = Tree;

export default function ScenarioGroups() {
  const {
    form,
    newGroupOpen,
    editGroupOpen,
    currentGroup,
    setNewGroupOpen,
    handleCreateGroup,
    handleEditGroup,
    closeNewGroupModal,
    closeEditGroupModal,
  } = useScenarioGroups();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Card
      style={{
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          height: "100%",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <GroupOutlined className="text-lg" />
            <Title level={4} style={{ margin: 0 }}>
              Groups
            </Title>
          </div>
          <div>
            <Tooltip title="Drag and drop to reorder">
              <Button
                size="small"
                type="text"
                icon={<DropboxOutlined />}
                onClick={() => setIsDragging(!isDragging)}
              />
            </Tooltip>
            <Button
              size="small"
              type="text"
              icon={<PlusOutlined />}
              onClick={() => setNewGroupOpen(true)}
            />
          </div>
        </div>
        <ScenarioGroupsTree isDragging={isDragging} />
      </div>

      <GroupModal
        open={newGroupOpen}
        isEdit={false}
        onCancel={closeNewGroupModal}
        onOk={handleCreateGroup}
        form={form}
      />

      <GroupModal
        open={editGroupOpen}
        isEdit={true}
        currentGroup={currentGroup}
        onCancel={closeEditGroupModal}
        onOk={handleEditGroup}
        form={form}
      />
    </Card>
  );
}

const ScenarioGroupsTree = ({ isDragging }: { isDragging: boolean }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["null"]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["null"]);
  const { scenarios, scenariosGroups } = useScenarioGroups();

  const onExpand: TreeProps["onExpand"] = useCallback(
    (
      expandedKeys: React.Key[],
      info: {
        node: EventDataNode<TreeDataNode>;
        expanded: boolean;
        nativeEvent: MouseEvent;
      },
    ) => {
      const key = info.node.key;
      const expanded = !info.expanded;
      const isNotSelected = !selectedKeys.includes(key as string);
      if (expanded && isNotSelected) return;
      setExpandedKeys(expandedKeys as string[]);
    },
    [selectedKeys],
  );

  const onSelect: TreeProps["onSelect"] = useCallback(
    (
      selectedKeys: React.Key[],
      info: {
        event: "select";
        selected: boolean;
        node: EventDataNode<TreeDataNode>;
        selectedNodes: TreeDataNode[];
        nativeEvent: MouseEvent;
      },
    ) => {
      const id = selectedKeys[0] as string;
      if (!id) {
        return;
      }

      setSelectedKeys(selectedKeys as string[]);
      const isGroup =
        info.selectedNodes.length > 0 && info.selectedNodes[0]?.children;
      if (isGroup) {
        dispatch(setSelectedGroupId(id));
        router.push(`/scenarios`);
      } else {
        dispatch(setSelectedScenarioId(id));
        router.push(`/scenarios/${id}`);
      }
    },
    [dispatch, router],
  );

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log("onDrop", info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    console.log("dropKey", dropKey);
    console.log("dragKey", dragKey);
    console.log("dropPosition", dropPosition);

    if (dropPosition < 0) {
      return;
    }
  };

  const mergedScenarioGroups: ScenarioGroup[] = useMemo(
    () => [
      {
        id: "null",
        name: "No Group",
        description: "",
        scenarios:
          scenarios?.map((scenario) => ({
            id: scenario.id,
            name: scenario.name,
            type: scenario.type,
          })) || [],
      },
      ...(scenariosGroups || []),
    ],
    [scenarios, scenariosGroups],
  );

  const treeData: TreeDataNode[] | undefined = useMemo(
    () =>
      mergedScenarioGroups?.map((group) => ({
        key: group.id || "null",
        title: `${group.name} (${group.scenarios.length})`,
        children:
          group.scenarios.length > 0
            ? group.scenarios.map((scenario) => ({
                key: scenario.id,
                title: scenario.name,
                icon: getScenarioIconByType({ type: scenario.type }),
              }))
            : [
                {
                  key: `${group.id}-empty`,
                  title: "No scenarios",
                  icon: <FileOutlined />,
                  disabled: true,
                },
              ],
      })),
    [mergedScenarioGroups],
  );

  console.log("rerender");

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        scrollbarGutter: "stable",
        paddingRight: "4px",
      }}
    >
      <DirectoryTree
        showIcon
        showLine
        blockNode
        draggable={isDragging}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        onSelect={onSelect}
        onDrop={onDrop}
      />
    </div>
  );
};
