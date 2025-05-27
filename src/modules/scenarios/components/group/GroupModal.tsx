import { Modal, Form, Input } from "antd";
import { ScenarioGroup } from "@/scenarios/types/scenarioGroup";
import { colors } from "@/shared/constants/colors";

interface GroupModalProps {
  open: boolean;
  isEdit: boolean;
  currentGroup?: ScenarioGroup | null;
  onCancel: () => void;
  onOk: () => void;
  form: ReturnType<typeof Form.useForm>[0];
}

export default function GroupModal(props: GroupModalProps) {
  const { open, isEdit, currentGroup, onCancel, onOk, form } = props;
  return (
    <Modal
      title={isEdit ? "Edit Group" : "Create New Group"}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      closeIcon={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          isEdit && currentGroup ? currentGroup : { color: colors.primary }
        }
      >
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: "Please enter a group name" }]}
        >
          <Input placeholder="API Tests" />
        </Form.Item>
        <Form.Item name="description" label="Description (Optional)">
          <Input placeholder="All API-related test scenarios" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
