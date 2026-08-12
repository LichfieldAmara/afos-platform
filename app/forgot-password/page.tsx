import { requestPasswordReset } from "@/app/actions/auth";
import { ResetRequestForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Account recovery" title="Reset your password" copy="Enter your work email. We will send instructions if it belongs to an AFOS account.">
      <ResetRequestForm action={requestPasswordReset} />
    </AuthShell>
  );
}

