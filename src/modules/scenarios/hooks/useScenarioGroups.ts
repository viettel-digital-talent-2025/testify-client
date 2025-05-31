"use client";
import { useCallback } from "react";
import { Form } from "antd";
import {
  useCreateScenarioGroupMutation,
  useUpdateScenarioGroupMutation,
} from "../apis/scenarioGroupApi";
import {
  CreateScenarioGroupRequest,
  UpdateScenarioGroup,
} from "../types/scenarioGroup";
import { useNotification } from "@/shared/hooks";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useStore";
import { setCurrentEditGroup } from "../slices/scenarioGroupsSlice";
import {
  selectNewGroupOpen,
  selectEditGroupOpen,
  setNewGroupOpen,
  setEditGroupOpen,
  selectCurrentEditGroup,
} from "../slices/scenarioGroupsSlice";

export function useScenarioGroups() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { notify } = useNotification();

  const editGroupOpen = useAppSelector(selectEditGroupOpen);
  const newGroupOpen = useAppSelector(selectNewGroupOpen);
  const currentEditGroup = useAppSelector(selectCurrentEditGroup);
  const [createGroup] = useCreateScenarioGroupMutation();
  const [updateGroup] = useUpdateScenarioGroupMutation();

  const handleCreateGroup = useCallback(async () => {
    const values = await form.validateFields();
    const newGroup: CreateScenarioGroupRequest = {
      name: values.name,
      description: values.description,
    };

    const res = await createGroup(newGroup);
    if (!res.error) {
      form.resetFields();
      dispatch(setNewGroupOpen(false));
    } else {
      notify({
        message: "Failed to create group",
        description: "Please try again",
        notiType: "error",
      });
    }
  }, [dispatch, notify, createGroup, form]);

  const handleEditGroup = useCallback(async () => {
    if (!currentEditGroup) return;

    const values = await form.validateFields();
    const updatedGroup: UpdateScenarioGroup = {
      id: currentEditGroup.id,
      name: values.name,
      description: values.description,
    };

    const res = await updateGroup(updatedGroup);
    if (!res.error) {
      form.resetFields();
      dispatch(setEditGroupOpen(false));
    } else {
      notify({
        message: "Failed to update group",
        description: "Please try again",
        notiType: "error",
      });
    }
  }, [dispatch, notify, updateGroup, form, currentEditGroup]);

  const closeNewGroupModal = useCallback(() => {
    form.resetFields();
    dispatch(setNewGroupOpen(false));
    dispatch(setCurrentEditGroup(null));
  }, [dispatch, form]);

  const closeEditGroupModal = useCallback(() => {
    form.resetFields();
    dispatch(setEditGroupOpen(false));
    dispatch(setCurrentEditGroup(null));
  }, [dispatch, form]);

  return {
    dispatch,
    form,
    currentEditGroup,
    editGroupOpen,
    newGroupOpen,
    handleCreateGroup,
    handleEditGroup,
    closeNewGroupModal,
    closeEditGroupModal,
  };
}
