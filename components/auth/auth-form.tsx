"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthActionState } from "@/app/actions/auth";

type AuthAction = (
  state: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="auth-submit" disabled={pending} type="submit">
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function SignInForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="auth-form" action={formAction}>
      <label htmlFor="email">Work email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
      {state.message && <p className="form-message form-error" role="alert">{state.message}</p>}
      <SubmitButton>Sign in securely</SubmitButton>
      <Link className="auth-link" href="/forgot-password">Forgot your password?</Link>
    </form>
  );
}

export function ResetRequestForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="auth-form" action={formAction}>
      <label htmlFor="email">Work email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      {state.message && <p className={`form-message ${state.success ? "form-success" : "form-error"}`} role="status">{state.message}</p>}
      <SubmitButton>Send reset instructions</SubmitButton>
      <Link className="auth-link" href="/login">Return to sign in</Link>
    </form>
  );
}

export function UpdatePasswordForm({ action }: { action: AuthAction }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="auth-form" action={formAction}>
      <label htmlFor="password">New password</label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <label htmlFor="confirmation">Confirm new password</label>
      <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
      {state.message && <p className="form-message form-error" role="alert">{state.message}</p>}
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}

