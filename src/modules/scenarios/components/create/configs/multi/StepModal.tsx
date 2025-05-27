"use client";
import { Modal, Form, Input } from "antd";
import { useEffect, useMemo } from "react";
import { useScenarioFormContext } from "@/scenarios/contexts/ScenarioFormContext";

export default function StepModal() {
  const { form, strategy, editingStep, modalVisible, setModalVisible } =
    useScenarioFormContext();
  const [modalForm] = Form.useForm();
  const stepPath = useMemo(
    () => ["flows", editingStep.flowName, "steps", editingStep.name],
    [editingStep.flowName, editingStep.name],
  );

  // Reset the form fields when the modal is opened
  useEffect(() => {
    if (!modalVisible) return;

    const step = form.getFieldValue(stepPath);
    if (!step?.type) return;

    modalForm.resetFields();
    modalForm.setFieldsValue({
      name: step.name,
      description: step.description,
      config: step.config,
    });
  }, [form, modalVisible, stepPath, modalForm]);

  // TypeComponent is the component that will be rendered in the modal
  const TypeComponent = useMemo(() => {
    if (!modalVisible) return null;

    const step = form.getFieldValue(stepPath);
    if (!step?.type) return null;

    return strategy.renderForm(`${editingStep.flowName}-${editingStep.name}`);
  }, [
    modalVisible,
    form,
    stepPath,
    strategy,
    editingStep.flowName,
    editingStep.name,
  ]);

  const handleOk = async () => {
    await modalForm.validateFields();
    if (modalForm.getFieldsError().some((field) => field.errors.length > 0)) {
      return;
    }

    const { name, description, config } = modalForm.getFieldsValue();
    form.setFieldValue(stepPath, {
      ...form.getFieldValue(stepPath),
      name,
      description,
      config,
    });

    setModalVisible(false);
  };

  return (
    <Modal
      title={"Edit Step"}
      open={modalVisible}
      onOk={handleOk}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
      destroyOnHidden
      width={800}
    >
      <Form
        key={`${editingStep.flowName}-${editingStep.name}`}
        form={modalForm}
        layout="vertical"
      >
        <div className="flex gap-4">
          <Form.Item
            name="name"
            label="Step Name"
            rules={[{ required: true, message: "Please enter step name" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter step name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Step Description"
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter step description" />
          </Form.Item>
        </div>
        {TypeComponent}
      </Form>
    </Modal>
  );
}
