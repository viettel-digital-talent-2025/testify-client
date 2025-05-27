"use client";
import { useState } from "react";
import { Form } from "antd";
import {
  useGetScenarioGroupsQuery,
  useCreateScenarioGroupMutation,
  useUpdateScenarioGroupMutation,
  useDeleteScenarioGroupMutation,
} from "../apis/scenarioGroupApi";
import {
  CreateScenarioGroup,
  UpdateScenarioGroup,
  ScenarioGroup,
} from "../types/scenarioGroup";
import { useNotification } from "@/shared/hooks";

export function useScenarioGroups() {
  const [form] = Form.useForm();
  const { notify } = useNotification();

  const { data } = useGetScenarioGroupsQuery();
  const [newGroupOpen, setNewGroupOpen] = useState<boolean>(false);
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [currentGroup, setCurrentGroup] = useState<ScenarioGroup | null>(null);

  const [createGroup] = useCreateScenarioGroupMutation();
  const [updateGroup] = useUpdateScenarioGroupMutation();
  const [deleteGroup] = useDeleteScenarioGroupMutation();

  const handleCreateGroup = async () => {
    const values = await form.validateFields();
    const newGroup: CreateScenarioGroup = {
      name: values.name,
      description: values.description,
    };

    const res = await createGroup(newGroup);
    if (!res.error) {
      setNewGroupOpen(false);
      form.resetFields();
      notify({
        message: "Group created successfully",
        description: "The group has been created successfully",
        notiType: "success",
      });
    } else {
      notify({
        message: "Failed to create group",
        description: "Please try again",
        notiType: "error",
      });
    }
  };

  const handleEditGroup = async () => {
    if (!currentGroup) return;

    const values = await form.validateFields();
    const updatedGroup: UpdateScenarioGroup = {
      id: currentGroup.id,
      name: values.name,
      description: values.description,
    };

    const res = await updateGroup(updatedGroup);
    if (!res.error) {
      setEditGroupOpen(false);
      form.resetFields();
      notify({
        message: "Group updated successfully",
        description: "The group has been updated successfully",
        notiType: "success",
      });
    } else {
      notify({
        message: "Failed to update group",
        description: "Please try again",
        notiType: "error",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    const res = await deleteGroup(groupId);
    if (!res.error) {
      notify({
        message: "Group deleted successfully",
        description: "The group has been deleted successfully",
        notiType: "success",
      });
    } else {
      notify({
        message: "Failed to delete group",
        description: "Please try again",
        notiType: "error",
      });
    }
  };

  const openEditDialog = (group: ScenarioGroup) => {
    setCurrentGroup(group);
    form.setFieldsValue({
      name: group.name,
      description: group.description,
    });
    setEditGroupOpen(true);
  };

  const closeNewGroupModal = () => {
    setNewGroupOpen(false);
    form.resetFields();
  };

  const closeEditGroupModal = () => {
    setEditGroupOpen(false);
    form.resetFields();
  };

  return {
    form,
    scenarios: data?.scenarios,
    scenariosGroups: data?.scenarioGroups,
    newGroupOpen,
    editGroupOpen,
    currentGroup,
    setNewGroupOpen,
    handleCreateGroup,
    handleEditGroup,
    handleDeleteGroup,
    openEditDialog,
    closeNewGroupModal,
    closeEditGroupModal,
  };
}
