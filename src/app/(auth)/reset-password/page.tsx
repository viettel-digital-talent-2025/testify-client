import { ResetPasswordForm } from "@/auth/components/form";
import {
  FormDescription,
  FormFooter,
  FormTitle,
} from "@/auth/components/form/Form";
import { Card } from "antd";

export default function ResetPasswordPage() {
  return (
    <Card>
      <FormTitle title="Reset your password" />
      <FormDescription description="Enter your email address and we'll send you a link to reset your password." />
      <ResetPasswordForm />
      <FormFooter
        description="Remember your password?"
        link="/login"
        linkText="Sign in"
      />
    </Card>
  );
}
