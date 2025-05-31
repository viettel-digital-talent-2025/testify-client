"use client";
import { useScenarioGroups } from "@/scenarios/hooks/useScenarioGroups";
import { colors } from "@/shared/constants/colors";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export default function GroupModal() {
  const {
    form,
    newGroupOpen,
    editGroupOpen,
    currentEditGroup,
    handleCreateGroup,
    handleEditGroup,
    closeNewGroupModal,
    closeEditGroupModal,
  } = useScenarioGroups();

  useEffect(() => {
    if (currentEditGroup) {
      form.setFieldsValue({
        name: currentEditGroup.name,
        description: currentEditGroup.description,
      });
    }
  }, [form, currentEditGroup]);

  return (
    <Modal
      title={newGroupOpen ? "Create New Group" : "Edit Group"}
      open={newGroupOpen || editGroupOpen}
      onCancel={newGroupOpen ? closeNewGroupModal : closeEditGroupModal}
      onOk={newGroupOpen ? handleCreateGroup : handleEditGroup}
      closeIcon={false}
    >
      <Form
        form={form}
        key={newGroupOpen ? "new-group" : "edit-group"}
        layout="vertical"
        initialValues={
          newGroupOpen && currentEditGroup
            ? currentEditGroup
            : { color: colors.primary }
        }
      >
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: "Please enter a group name" }]}
        >
          <Input placeholder="Group Name" />
        </Form.Item>
        <Form.Item name="description" label="Description (Optional)">
          <Input placeholder="Group Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
