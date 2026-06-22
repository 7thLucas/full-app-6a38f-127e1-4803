import { useNavigate } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import type { TExpectItem } from "~/modules/configurables/src/constants/configurables.default";
import { BrandMark } from "~/components/landing/brand-mark";
import { BeginIntakeCTA } from "~/components/landing/begin-intake-cta";
import { ExpectIcon } from "~/components/landing/expect-icon";
import { ShieldCheck } from "lucide-react";

export function meta() {
  return [
    { title: "IntakeFlow — Patient check-in" },
    {
      name: "description",
      content:
        "Complete your clinic intake from your own phone before you arrive. Calm, private, and quick.",
    },
  ];
}

export default function IndexPage() {
  const { config, loading } = useConfigurables();
  const navigate = useNavigate();
  const beginIntake = () => navigate("/intake");

  // Avoid SSR/CSR hydration mismatch: render a calm skeleton until config loads.
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
          <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
        </div>
      </main>
    );
  }

  const appName = config?.appName ?? "IntakeFlow";
  const tagline = config?.tagline ?? "";
  const logoUrl = config?.logoUrl ?? "";
  const heroHeadline =
    config?.heroHeadline ?? "Welcome — let's get you checked in.";
  const heroSubtext = config?.heroSubtext ?? "";
  const primaryCtaLabel = config?.primaryCtaLabel ?? "Begin intake";
  const ctaHelperText = config?.ctaHelperText ?? "";
  const expectSectionTitle = config?.expectSectionTitle ?? "What to expect";
  const expectItems: TExpectItem[] = config?.expectItems ?? [];
  const footerText = config?.footerText ?? "";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Soft teal wash behind the top of the page for warmth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-secondary/70 via-background to-background"
      />

      {/* Header / brand */}
      <header className="mx-auto w-full max-w-3xl px-6 pt-8 sm:pt-10">
        <BrandMark appName={appName} logoUrl={logoUrl} tagline={tagline} />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
        {/* Hero */}
        <section className="flex flex-col items-center pt-12 text-center sm:pt-16">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            Patient check-in
          </span>

          <h1 className="max-w-xl text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heroHeadline}
          </h1>

          {heroSubtext ? (
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {heroSubtext}
            </p>
          ) : null}

          <BeginIntakeCTA
            label={primaryCtaLabel}
            helperText={ctaHelperText}
            onBegin={beginIntake}
            className="mt-9"
          />
        </section>

        {/* What to expect */}
        {expectItems.length > 0 ? (
          <section className="mt-16 sm:mt-20">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Before you begin
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {expectSectionTitle}
              </h2>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {expectItems.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <ExpectIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-card-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Reassurance / secondary CTA band */}
        <section className="mt-16 sm:mt-20">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-6 py-10 text-center sm:px-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShieldCheck
                className="h-6 w-6"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <p className="max-w-md text-pretty text-lg font-medium leading-relaxed text-card-foreground">
              Ready when you are. It only takes a couple of calm minutes.
            </p>
            <BeginIntakeCTA label={primaryCtaLabel} onBegin={beginIntake} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-16 w-full max-w-3xl px-6 pb-10 sm:mt-20">
        <div className="border-t border-border pt-6">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {footerText}
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} {appName}
          </p>
        </div>
      </footer>
    </div>
  );
}
