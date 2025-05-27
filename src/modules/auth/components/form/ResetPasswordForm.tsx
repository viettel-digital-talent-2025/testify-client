"use client";
import { Form, Input, Button } from "antd";
import { useResetPasswordMutation } from "@/auth/apis/authApi";
import {
  useAppDispatch,
  useAppSelector,
  useNotification,
} from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { reset, selectEmail, selectOtp } from "@/auth/slices/recoveryPassSlice";

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectEmail);
  const otp = useAppSelector(selectOtp);
  const router = useRouter();
  const [form] = Form.useForm();
  const { notify } = useNotification();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  if (!email || !otp) {
    router.push("/login");
    return;
  }

  const onFinish = async () => {
    const { newPassword, confirmPassword } = await form.validateFields();
    const res = await resetPassword({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    if (!res.error) {
      notify({
        message: "Password reset successfully",
        description: "You can now login with your new password",
        notiType: "success",
      });
      dispatch(reset());
      router.push("/login");
    } else {
      notify({
        message: "Password reset failed",
        description: "Please try again",
        notiType: "error",
      });
    }
  };

  return (
    <Form
      form={form}
      name="reset-password"
      layout="vertical"
      size="large"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: "Please enter your new password" },
          { min: 6, message: "Password must be at least 8 characters" },
        ]}
        required
      >
        <Input.Password placeholder="Enter new password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm New Password"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your new password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}
        required
      >
        <Input.Password placeholder="Confirm new password" />
      </Form.Item>

      <Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          loading={isResetting}
          block
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}
