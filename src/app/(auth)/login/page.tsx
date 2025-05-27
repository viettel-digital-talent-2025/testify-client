import { Card } from "antd";
import {
  FormTitle,
  FormDescription,
  FormFooter,
} from "@/auth/components/form/Form";
import { LoginForm } from "@/auth/components/form";

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
