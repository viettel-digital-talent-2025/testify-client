import { Card } from "antd";
import {
  FormTitle,
  FormDescription,
  FormFooter,
} from "@/modules/auth/components/form/Form";
import { RegisterForm } from "@/modules/auth/components/form";

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
