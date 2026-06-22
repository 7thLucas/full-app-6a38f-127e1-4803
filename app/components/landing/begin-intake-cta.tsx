import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * BeginIntakeCTA — the single primary action of the landing page.
 *
 * This is intentionally the one place where the future intake flow will plug
 * in. Today it renders a prominent button; in a later version, `onBegin` (or a
 * route link) will open the patient intake form. Keeping it isolated means the
 * rest of the page never needs to change when the form is added.
 */
export function BeginIntakeCTA({
  label,
  helperText,
  onBegin,
  className,
}: {
  label: string;
  helperText?: string;
  onBegin?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col items-center gap-3", className)}>
      <button
        type="button"
        onClick={onBegin}
        className={cn(
          "group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4",
          "text-base font-semibold text-primary-foreground shadow-sm",
          "transition-all duration-200 hover:brightness-105 hover:shadow-md",
          "active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "sm:w-auto sm:min-w-[16rem]",
        )}
      >
        {label}
        <ArrowRight
          className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
      {helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
