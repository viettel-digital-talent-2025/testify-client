import { LoginForm } from "@/auth/components/form";
import {
  FormDescription,
  FormFooter,
  FormTitle,
} from "@/auth/components/form/Form";
import { Card } from "antd";

export default function LoginPage() {
  return (
    <Card>
      <FormTitle title="Sign in to Testify" />
      <FormDescription description="Welcome back! Please enter your credentials." />
      <LoginForm />
      <FormFooter
        description="Don't have an account?"
        link="/register"
        linkText="Register"
      />
    </Card>
  );
}
