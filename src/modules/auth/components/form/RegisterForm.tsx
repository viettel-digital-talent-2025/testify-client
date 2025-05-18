"use client";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Space } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRegisterMutation } from "@/modules/auth/redux/authApi";
import { useNotification } from "@/modules/shared/hooks";
import { ReduxUtils } from "@/modules/shared/utils";

export default function RegisterForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { notify } = useNotification();
  const [register, { isLoading }] = useRegisterMutation();

  const handleFinish = async () => {
    const values = await form.validateFields();
    const res = await register(values);

    if (res.error) {
      notify({
        message: "Failed to create account",
        description: ReduxUtils.extractErrMsg(res.error),
        notiType: "error",
      });
    } else {
      notify({
        message: "Account created successfully",
        description: ReduxUtils.extractSuccessMsg(res.data),
        notiType: "success",
      });
      router.push("/dashboard");
    }
  };

  return (
    <Form
      form={form}
      name="register"
      size="large"
      onFinish={handleFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item label="Full Name">
        <Space.Compact>
          <Form.Item
            noStyle
            name="firstname"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="First Name"
              autoComplete="firstname"
            />
          </Form.Item>
          <Form.Item
            noStyle
            name="lastname"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Last Name" autoComplete="lastname" />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

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
        rules={[
          { required: true, message: "Please enter your password" },
          { min: 8, message: "Password must be at least 8 characters" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
}
