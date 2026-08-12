import { redirect } from "next/navigation";

import { signIn } from "@/app/actions/auth";
import { SignInForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/app");
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to AFOS" copy="Pilot access is invitation-only. Use the work email attached to your AFOS account.">
      <SignInForm action={signIn} />
    </AuthShell>
  );
}
