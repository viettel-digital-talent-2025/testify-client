"use client";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLoginMutation } from "@/auth/apis/authApi";
import { useNotification } from "@/shared/hooks";
import { ReduxUtils } from "@/shared/utils";
import { useRouter } from "next/navigation";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const { notify } = useNotification();

  const handleFinish = async () => {
    const values = await form.validateFields();
    const res = await login(values);

    if (!res.error) {
      notify({
        message: "Login successful",
        description: ReduxUtils.extractSuccessMsg(res.data),
        notiType: "success",
      });
      router.push("/dashboard");
    } else {
      notify({
        message: "Failed to login",
        description: ReduxUtils.extractErrMsg(res.error),
        notiType: "error",
      });
    }
  };

  return (
    <Form
      form={form}
      name="login"
      size="large"
      onFinish={handleFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>

      <Paragraph style={{ textAlign: "right" }}>
        <Link href="/forgot-password">
          <Text strong>Forgot Password?</Text>
        </Link>
      </Paragraph>

      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}
