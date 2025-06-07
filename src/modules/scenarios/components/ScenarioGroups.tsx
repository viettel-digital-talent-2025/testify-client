"use client";
import {
  selectIsDragging,
  setCurrentEditGroup,
  setEditGroupOpen,
  setNewGroupOpen,
} from "@/scenarios/slices/scenarioGroupsSlice";
import {
  setSelectedGroupId,
  setSelectedScenarioId,
} from "@/scenarios/slices/scenariosSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useStore";
import {
  DownOutlined,
  GroupOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Tree,
  TreeDataNode,
  TreeProps,
} from "antd";
import { EventDataNode } from "antd/es/tree";
import Title from "antd/es/typography/Title";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  useDeleteScenarioGroupMutation,
  useGetScenarioGroupsQuery,
} from "../apis/scenarioGroupApi";
import { ScenarioGroup } from "../types/scenarioGroup";
import { getScenarioIconByType } from "../utils";
import { GroupModal } from "./group";
import "./ScenarioGroups.css";
const { DirectoryTree } = Tree;

const ScenarioGroupsHeader = memo(() => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <GroupOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Groups
        </Title>
      </div>
      <div>
        {/* <Tooltip title="Drag and drop to reorder">
          <Button
            size="small"
            type="text"
            icon={<DropboxOutlined />}
            onClick={() => dispatch(setReverseIsDragging())}
          />
        </Tooltip> */}
        <Button
          size="small"
          type="text"
          icon={<PlusOutlined />}
          onClick={() => dispatch(setNewGroupOpen(true))}
        />
      </div>
    </div>
  );
});

ScenarioGroupsHeader.displayName = "ScenarioGroupsHeader";

const ScenarioGroupsTree = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const isDragging = useAppSelector(selectIsDragging);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["null"]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["null"]);
  const [deleteGroup] = useDeleteScenarioGroupMutation();
  const { data } = useGetScenarioGroupsQuery();

  useEffect(() => {
    if (params.id) {
      setSelectedKeys([params.id as string]);
    }
  }, [params.id]);

  useEffect(() => {
    if (data?.scenarioGroups?.length) {
      setExpandedKeys([
        "null",
        ...data.scenarioGroups.map((group) => group.id),
      ]);
    }
  }, [data?.scenarioGroups]);

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
      const isExpanded = info.expanded;
      const isNotSelected = !selectedKeys.includes(key as string);
      const target = info.nativeEvent.target as HTMLElement;
      if (
        isNotSelected &&
        target.tagName !== "svg" &&
        target.tagName !== "SPAN" &&
        !isExpanded
      ) {
        return;
      }
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

  const mergedScenarioGroups: ScenarioGroup[] = useMemo(
    () => [
      {
        id: "null",
        name: "No Group",
        description: "",
        scenarios:
          data?.scenarios?.map((scenario) => ({
            id: scenario.id,
            name: scenario.name,
            type: scenario.type,
          })) || [],
      },
      ...(data?.scenarioGroups || []),
    ],
    [data],
  );

  const treeData: TreeDataNode[] | undefined = useMemo(
    () =>
      mergedScenarioGroups?.map((group) => ({
        key: group.id || "null",
        title: (
          <div className="flex w-full items-center justify-between">
            {`${group.name} (${group.scenarios.length})`}
            {group.name !== "No Group" && (
              <ScenarioGroupDropdown
                onEditGroup={async (e) => {
                  e.stopPropagation();
                  dispatch(setCurrentEditGroup(group));
                  dispatch(setEditGroupOpen(true));
                }}
                onDeleteGroup={async (e) => {
                  e.stopPropagation();
                  await deleteGroup(group.id);
                }}
              />
            )}
          </div>
        ),
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
                  disabled: true,
                },
              ],
      })),
    [mergedScenarioGroups, dispatch, deleteGroup],
  );

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        scrollbarGutter: "stable",
      }}
    >
      <DirectoryTree
        // showIcon
        showLine
        blockNode
        draggable={isDragging}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        onSelect={onSelect}
        defaultExpandAll
      />
    </div>
  );
});

ScenarioGroupsTree.displayName = "ScenarioGroupsTree";

export default memo(function ScenarioGroups() {
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
        <ScenarioGroupsHeader />
        <ScenarioGroupsTree />
      </div>
      <GroupModal />
    </Card>
  );
});

const ScenarioGroupDropdown = memo(
  ({
    onEditGroup,
    onDeleteGroup,
  }: {
    onEditGroup: (e: React.MouseEvent) => void;
    onDeleteGroup: (e: React.MouseEvent) => void;
  }) => {
    const items: MenuProps["items"] = useMemo(
      () => [
        {
          key: "edit",
          label: "Edit",
          onClick: ({ domEvent }) => {
            onEditGroup(domEvent as React.MouseEvent);
          },
        },
        {
          key: "delete",
          label: "Delete",
          danger: true,
          onClick: ({ domEvent }) => {
            onDeleteGroup(domEvent as React.MouseEvent);
          },
        },
      ],
      [onEditGroup, onDeleteGroup],
    );

    return (
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    );
  },
);

ScenarioGroupDropdown.displayName = "ScenarioGroupDropdown";
