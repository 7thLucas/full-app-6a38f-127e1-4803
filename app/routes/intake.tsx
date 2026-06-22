import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import type {
  TVisitReason,
} from "~/modules/configurables/src/constants/configurables.default";
import { BrandMark } from "~/components/landing/brand-mark";
import { apiRequest } from "~/lib/api.client";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "Patient intake — check in" },
    {
      name: "description",
      content: "Share a few quick details so your care team is ready for you.",
    },
  ];
}

interface IntakeResult {
  reference: string;
  status: string;
  smsStatus: string;
}

const labelCls = "text-sm font-medium text-foreground";
const fieldCls = cn(
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground",
  "placeholder:text-muted-foreground/70 shadow-sm",
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40",
  "disabled:opacity-60",
);

export default function IntakePage() {
  const { config, loading } = useConfigurables();

  const appName = config?.appName ?? "IntakeFlow";
  const logoUrl = config?.logoUrl ?? "";
  const tagline = config?.tagline ?? "";
  const heading = config?.intakeHeading ?? "Tell us a little about your visit";
  const subtext =
    config?.intakeSubtext ??
    "A few quick details so your care team is ready for you.";
  const submitLabel = config?.intakeSubmitLabel ?? "Submit & check in";
  const reasons: TVisitReason[] = config?.visitReasons ?? [];
  const successTitle = config?.successTitle ?? "You're checked in.";
  const successMessage =
    config?.successMessage ??
    "Thanks — the clinic has your details and will see you shortly.";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntakeResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: String(data.get("fullName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      dateOfBirth: String(data.get("dateOfBirth") ?? "") || null,
      reasonForVisit: String(data.get("reasonForVisit") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
    };

    if (payload.fullName.length < 2) {
      setError("Please enter the patient's full name.");
      return;
    }
    if (!payload.phone) {
      setError("Please enter a mobile number so we can confirm by SMS.");
      return;
    }
    if (!payload.reasonForVisit) {
      setError("Please choose a reason for your visit.");
      return;
    }

    setSubmitting(true);
    const response = await apiRequest<IntakeResult>("/api/intake", {
      method: "POST",
      data: payload,
    });
    setSubmitting(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.message ?? "Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </main>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] bg-gradient-to-b from-secondary/70 via-background to-background"
      />

      <header className="mx-auto w-full max-w-2xl px-6 pt-8 sm:pt-10">
        <BrandMark appName={appName} logoUrl={logoUrl} tagline={tagline} />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-16 pt-10">
        {result ? (
          <ConfirmationCard
            title={successTitle}
            message={successMessage}
            reference={result.reference}
            smsStatus={result.smsStatus}
          />
        ) : (
          <>
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {heading}
            </h1>
            <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
              {subtext}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className={labelCls}>
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={submitting}
                  className={fieldCls}
                  placeholder="e.g. Jordan Tan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className={labelCls}>
                  Mobile number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  disabled={submitting}
                  className={fieldCls}
                  placeholder="e.g. +65 8123 4567"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send your confirmation here by SMS.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="dateOfBirth" className={labelCls}>
                  Date of birth{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  disabled={submitting}
                  className={fieldCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="reasonForVisit" className={labelCls}>
                  Reason for visit
                </label>
                <select
                  id="reasonForVisit"
                  name="reasonForVisit"
                  required
                  disabled={submitting}
                  defaultValue=""
                  className={fieldCls}
                >
                  <option value="" disabled>
                    Select a reason…
                  </option>
                  {reasons.map((reason, index) => (
                    <option key={`${reason.label}-${index}`} value={reason.label}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className={labelCls}>
                  Anything else we should know?{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  disabled={submitting}
                  className={cn(fieldCls, "resize-y")}
                  placeholder="Symptoms, allergies, accessibility needs…"
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4",
                  "text-base font-semibold text-primary-foreground shadow-sm",
                  "transition-all duration-200 hover:brightness-105 hover:shadow-md",
                  "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

function ConfirmationCard({
  title,
  message,
  reference,
  smsStatus,
}: {
  title: string;
  message: string;
  reference: string;
  smsStatus: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-12 text-center sm:px-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
        {message}
      </p>

      <div className="mt-8 w-full max-w-xs rounded-2xl bg-secondary px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
          Your reference
        </p>
        <p className="mt-1 text-3xl font-bold tracking-[0.2em] text-primary">
          {reference}
        </p>
      </div>

      <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        {smsStatus === "sent"
          ? "A confirmation SMS is on its way."
          : smsStatus === "skipped"
            ? "Confirmation noted — SMS isn't configured for this clinic yet."
            : "We couldn't send the SMS, but your check-in is saved."}
      </p>

      <Link
        to="/"
        className="mt-8 text-sm font-medium text-primary transition-colors hover:brightness-110"
      >
        Done
      </Link>
    </div>
  );
}
