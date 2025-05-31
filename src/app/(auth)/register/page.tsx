import { RegisterForm } from "@/auth/components/form";
import {
  FormDescription,
  FormFooter,
  FormTitle,
} from "@/auth/components/form/Form";
import { Card } from "antd";

export default function RegisterPage() {
  return (
    <Card>
      <FormTitle title="Create your account" />
      <FormDescription description="Join Testify to start your journey." />
      <RegisterForm />
      <FormFooter
        description="Already have an account?"
        link="/login"
        linkText="Sign in"
      />
    </Card>
  );
}
