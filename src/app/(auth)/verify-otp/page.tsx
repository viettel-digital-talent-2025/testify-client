import { VerifyOTPForm } from "@/auth/components/form";
import {
  FormDescription,
  FormFooter,
  FormTitle,
} from "@/auth/components/form/Form";
import { Card } from "antd";

export default function VerifyOtpPage() {
  return (
    <Card>
      <FormTitle title="Verify your OTP" />
      <FormDescription description="Enter the OTP sent to your email address." />
      <VerifyOTPForm />
      <FormFooter
        description="Remember your password?"
        link="/login"
        linkText="Sign in"
      />
    </Card>
  );
}
