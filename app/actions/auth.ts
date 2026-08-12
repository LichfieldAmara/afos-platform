"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = { message: string; success?: boolean };

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

const emailSchema = z.email("Enter a valid email address.").trim().toLowerCase();

export async function signIn(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { message: "The email or password is incorrect." };
  }

  redirect("/app");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Check your email." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: origin ? `${origin}/auth/callback?next=/reset-password` : undefined,
  });

  if (error) {
    return { message: "We could not send the reset email. Try again shortly." };
  }

  return {
    message: "If an AFOS account exists for that email, reset instructions have been sent.",
    success: true,
  };
}

export async function updatePassword(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = z.string().min(8).safeParse(formData.get("password"));
  const confirmation = formData.get("confirmation");

  if (!password.success) {
    return { message: "Password must contain at least 8 characters." };
  }

  if (password.data !== confirmation) {
    return { message: "The passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });

  if (error) {
    return { message: "The password could not be updated. Request a new link." };
  }

  redirect("/app");
}

