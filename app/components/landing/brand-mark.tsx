import { HeartPulse } from "lucide-react";

/**
 * BrandMark — the IntakeFlow clinic identity shown at the top of the page.
 * Uses the owner-configured logo image when provided, otherwise falls back to
 * a calm teal monogram badge so the page always reads as branded.
 */
export function BrandMark({
  appName,
  logoUrl,
  tagline,
}: {
  appName: string;
  logoUrl?: string;
  tagline?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${appName} logo`}
          className="h-11 w-11 rounded-xl object-cover"
        />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HeartPulse className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-foreground">
          {appName}
        </span>
        {tagline ? (
          <span className="text-xs font-medium text-muted-foreground">
            {tagline}
          </span>
        ) : null}
      </div>
    </div>
  );
}
