"use client";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "antd";
import { useForgotPasswordMutation } from "@/modules/auth/apis/authApi";
import { useAppDispatch, useNotification } from "@/modules/shared/hooks";
import { setEmail } from "@/modules/auth/slices/recoveryPassSlice";
import { ReduxUtils } from "@/modules/shared/utils";

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { notify } = useNotification();

  const onFinish = async () => {
    const values = await form.validateFields();
    const res = await forgotPassword(values);
    if (!res.error) {
      notify({
        message: "OTP sent to your email",
        description: ReduxUtils.extractSuccessMsg(res.data),
        notiType: "success",
      });
      dispatch(setEmail(values.email));
      router.push("/verify-otp");
    } else {
      notify({
        message: "Failed to send reset OTP",
        description: ReduxUtils.extractErrMsg(res.error),
        notiType: "error",
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="forgot-password"
      size="large"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Send OTP
        </Button>
      </Form.Item>
    </Form>
  );
}
