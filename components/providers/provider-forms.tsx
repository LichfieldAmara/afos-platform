"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ProviderActionState } from "@/app/actions/providers";

type Action = (state: ProviderActionState, formData: FormData) => Promise<ProviderActionState>;

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button className="form-submit" type="submit" disabled={pending}>{pending ? "Saving…" : children}</button>;
}

export function CreateProviderForm({ action }: { action: Action }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="record-form" action={formAction}>
      <div className="field-span"><label htmlFor="name">Provider name</label><input id="name" name="name" required minLength={2} /></div>
      <div><label htmlFor="registrationNumber">Registration number</label><input id="registrationNumber" name="registrationNumber" /></div>
      <div><label htmlFor="contactName">Operational contact</label><input id="contactName" name="contactName" /></div>
      <div><label htmlFor="contactPhone">Contact phone</label><input id="contactPhone" name="contactPhone" inputMode="tel" /></div>
      {state.message && <p className={`form-message field-span ${state.success ? "form-success" : "form-error"}`}>{state.message}</p>}
      <div className="field-span"><Submit>Create provider</Submit></div>
    </form>
  );
}

export function ReviewProviderForm({ action, verificationId, currentStatus }: { action: Action; verificationId: string; currentStatus: string }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="review-form" action={formAction}>
      <input type="hidden" name="verificationId" value={verificationId} />
      <label><span>Decision</span><select name="decision" defaultValue={currentStatus === "draft" ? "under_review" : currentStatus}>
        <option value="under_review">Under review</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option>
      </select></label>
      <label><span>Reason / review note</span><input name="reason" maxLength={500} /></label>
      {state.message && <p className={`form-message ${state.success ? "form-success" : "form-error"}`}>{state.message}</p>}
      <Submit>Save review</Submit>
    </form>
  );
}

