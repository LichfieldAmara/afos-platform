import { updatePassword } from "@/app/actions/auth";
import { UpdatePasswordForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Secure account" title="Choose a new password" copy="Use at least eight characters and do not reuse a password from another service.">
      <UpdatePasswordForm action={updatePassword} />
    </AuthShell>
  );
}
