import { Card } from "antd";
import {
  FormTitle,
  FormDescription,
  FormFooter,
} from "@/modules/auth/components/form/Form";
import { ForgotPasswordForm } from "@/modules/auth/components/form";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <FormTitle title="Reset your password" />
      <FormDescription description="Enter your email address and we'll send you a link to reset your password." />
      <ForgotPasswordForm />
      <FormFooter
        description="Remember your password?"
        link="/login"
        linkText="Sign in"
      />
    </Card>
  );
}
