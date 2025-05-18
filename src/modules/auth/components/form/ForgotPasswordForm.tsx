"use client";

import { Form, Input, Button } from "antd";
import { useForgotPasswordMutation } from "@/modules/auth/redux/authApi";
import { ReduxUtils } from "@/modules/shared/utils";
import { useNotification } from "@/modules/shared/hooks";

export default function ForgotPasswordForm() {
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { notify } = useNotification();

  const onFinish = async () => {
    const values = await form.validateFields();
    const response = await forgotPassword(values);
    if (response.error) {
      notify({
        message: "Failed to send reset link",
        description: ReduxUtils.extractErrMsg(response.error),
        notiType: "error",
      });
    } else {
      notify({
        message: "Reset link sent",
        description: ReduxUtils.extractSuccessMsg(response.data),
        notiType: "success",
      });
    }
  };

  return (
    <Form
      form={form}
      name="forgot-password"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Enter your email" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          block
          size="large"
        >
          Send Reset Link
        </Button>
      </Form.Item>
    </Form>
  );
}
