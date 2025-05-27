"use client";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import {
  useAppDispatch,
  useAppSelector,
  useNotification,
} from "@/shared/hooks";
import { selectEmail, setOtp } from "@/auth/slices/recoveryPassSlice";
import { useVerifyOtpMutation } from "@/auth/apis/authApi";
import { ReduxUtils } from "@/shared/utils";

export default function VerifyOTPForm() {
  const email = useAppSelector(selectEmail);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const { notify } = useNotification();

  if (!email) {
    router.push("/forgot-password");
    return;
  }

  const onFinish = async () => {
    const { otp } = await form.validateFields();
    const res = await verifyOtp({ email, otp });
    if (!res.error) {
      notify({
        message: "OTP verified",
        description: "You can now reset your password",
        notiType: "success",
      });
      dispatch(setOtp(otp));
      router.push("/reset-password");
    } else {
      notify({
        message: "Failed to verify OTP",
        description: ReduxUtils.extractErrMsg(res.error),
        notiType: "error",
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="verify-otp"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
    >
      <Form.Item name="otp">
        <Input.OTP />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Verify
        </Button>
      </Form.Item>
    </Form>
  );
}
