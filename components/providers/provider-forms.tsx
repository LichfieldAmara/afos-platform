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
      <div><label htmlFor="kind">Provider type</label><select id="kind" name="kind"><option value="company">Registered company</option><option value="individual_owner">Individual vehicle owner</option></select></div><div><label htmlFor="declaredTrucks">How many trucks?</label><input id="declaredTrucks" name="declaredTrucks" type="number" min="0" defaultValue="1" required/></div><div><label htmlFor="declaredTrailers">How many trailers?</label><input id="declaredTrailers" name="declaredTrailers" type="number" min="0" defaultValue="1" required/></div><div className="field-span"><label htmlFor="name">Company or owner name</label><input id="name" name="name" required minLength={2} /></div>
      <div><label htmlFor="registrationNumber">Registration number</label><input id="registrationNumber" name="registrationNumber" /></div>
      <div><label htmlFor="contactName">Operational contact</label><input id="contactName" name="contactName" /></div>
      <div><label htmlFor="contactPhone">Contact phone</label><input id="contactPhone" name="contactPhone" inputMode="tel" /></div>
      <div><label htmlFor="contactEmail">Email (optional)</label><input id="contactEmail" name="contactEmail" type="email"/></div><div><label htmlFor="areas">Operating areas</label><input id="areas" name="areas" placeholder="Example: Freetown, Bo, Makeni"/></div>
      {state.message && <p className={`form-message field-span ${state.success ? "form-success" : "form-error"}`}>{state.message}</p>}
      <div className="field-span"><Submit>Create provider</Submit></div>
    </form>
  );
}
export function VehicleForm({action,providerId}:{action:Action;providerId:string}){const[s,a]=useActionState(action,{message:""});return <form action={a} className="vehicle-form"><input type="hidden" name="providerId" value={providerId}/><select name="kind"><option value="truck">Truck</option><option value="trailer">Trailer</option></select><input name="registration" required placeholder="Registration number"/><input name="size" placeholder="Trailer size, e.g. 40 foot"/><label><span>Insurance expiry</span><input name="insurance" type="date"/></label><label><span>Roadworthiness expiry</span><input name="roadworthiness" type="date"/></label><Submit>Register vehicle</Submit>{s.message&&<p className={`form-message ${s.success?"form-success":"form-error"}`}>{s.message}</p>}</form>}
export function DriverForm({action,providerId}:{action:Action;providerId:string}){const[s,a]=useActionState(action,{message:""});return <form action={a} className="vehicle-form"><input type="hidden" name="providerId" value={providerId}/><input name="name" required placeholder="Driver's full name"/><input name="phone" required inputMode="tel" placeholder="Phone number"/><input name="license" required placeholder="Driving licence number"/><label><span>Licence expiry</span><input name="expiry" type="date"/></label><Submit>Register driver</Submit>{s.message&&<p className={`form-message ${s.success?"form-success":"form-error"}`}>{s.message}</p>}</form>}
export function VehicleAvailabilityForm({action,id,kind}:{action:Action;id:string;kind:string}){const[s,a]=useActionState(action,{message:""});return <form action={a} className="vehicle-availability"><input type="hidden" name="vehicleId" value={id}/><input type="hidden" name="kind" value={kind}/><select name="status"><option value="active">Available</option><option value="inactive">Out of service</option></select><input name="availableAgain" type="date"/><input name="reason" placeholder="Reason if unavailable"/><Submit>Update</Submit>{s.message&&<p className={`form-message ${s.success?"form-success":"form-error"}`}>{s.message}</p>}</form>}

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
