"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { RequestActionState } from "@/app/actions/requests";

type Action = (state: RequestActionState, formData: FormData) => Promise<RequestActionState>;

function SubmitRequest() {
  const { pending } = useFormStatus();
  return <button className="request-submit" type="submit" disabled={pending}>{pending ? "Saving request…" : "Submit transport request"}</button>;
}

export function CreateRequestForm({ action }: { action: Action }) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form className="request-form" action={formAction}>
      <div className="request-help"><strong>You can complete this for a customer on the phone.</strong><span>Ask only the questions shown. A container number and weight can be added later.</span></div>

      <fieldset><legend><span>1</span><div><strong>Tell us about the container</strong><small>Enter the size and how many containers are moving.</small></div></legend>
        <div className="request-fields request-fields-single">
          <label><span>Customer or company name</span><input name="customerName" required minLength={2} autoComplete="organization" placeholder="Example: Amara Trading" /></label>
          <label><span>What size is the container?</span><small className="field-help">Type the size or select a common size.</small><input name="containerSize" required minLength={2} maxLength={40} list="container-size-options" placeholder="Example: 20 foot" /><datalist id="container-size-options"><option value="10 foot" /><option value="20 foot" /><option value="40 foot" /><option value="45 foot" /></datalist></label>
          <label><span>How many containers are moving?</span><small className="field-help">Type the number or select a suggested amount.</small><input name="quantity" type="number" inputMode="numeric" min={1} max={100} defaultValue={1} list="container-quantity-options" required /><datalist id="container-quantity-options"><option value="1" /><option value="2" /><option value="5" /><option value="10" /></datalist></label>
          <label><span>Container number <small>Optional</small></span><input name="containerNumber" autoCapitalize="characters" placeholder="Example: MSKU1234567" /></label>
          <label><span>Type of goods <small>Optional</small></span><input name="cargoCategory" placeholder="Example: Rice, cement, household goods" /></label>
          <label><span>Approximate weight in kg <small>Optional</small></span><input name="estimatedWeightKg" type="number" inputMode="decimal" min="1" max="100000" placeholder="Example: 24000" /></label>
        </div>
      </fieldset>

      <fieldset><legend><span>2</span><div><strong>Where and when?</strong><small>Plan the pickup and delivery.</small></div></legend>
        <div className="request-fields">
          <label><span>Pick up from</span><input name="pickupLocation" required minLength={2} placeholder="Example: Queen Elizabeth II Quay" /></label>
          <label><span>Deliver to</span><input name="destinationLocation" required minLength={2} placeholder="Town, area or clear landmark" /></label>
          <label className="wide"><span>When should pickup happen?</span><input name="requiredAt" type="datetime-local" required /></label>
        </div>
      </fieldset>

      <fieldset><legend><span>3</span><div><strong>Who should we call?</strong><small>Use the person coordinating this movement.</small></div></legend>
        <div className="request-fields">
          <label><span>Contact person</span><input name="contactName" required minLength={2} autoComplete="name" /></label>
          <label><span>Phone or WhatsApp number</span><input name="contactPhone" required minLength={5} inputMode="tel" autoComplete="tel" placeholder="Include country code when possible" /></label>
          <label className="wide"><span>Anything else we should know? <small>Optional</small></span><textarea name="notes" maxLength={500} rows={3} placeholder="Access instructions, preferred calling time, or special handling" /></label>
        </div>
      </fieldset>

      <div className="request-submit-row"><div><strong>What happens next?</strong><span>AFOS checks suitable verified capacity and contacts providers.</span></div><SubmitRequest /></div>
      {state.message && <p role="status" className={`form-message ${state.success ? "form-success" : "form-error"}`}>{state.message}</p>}
    </form>
  );
}
