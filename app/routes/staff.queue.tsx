import { useCallback, useEffect, useRef, useState } from "react";
import {
  Clock,
  Loader2,
  Phone,
  RefreshCw,
  Stethoscope,
  Check,
  X,
  Users,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { BrandMark } from "~/components/landing/brand-mark";
import { apiGet, apiRequest } from "~/lib/api.client";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Staff — intake queue" }];
}

type IntakeStatus =
  | "waiting"
  | "called"
  | "in_progress"
  | "completed"
  | "cancelled";

interface QueueItem {
  _id: string;
  reference: string;
  fullName: string;
  phone: string;
  reasonForVisit: string;
  notes: string;
  status: IntakeStatus;
  smsStatus: string;
  createdAt: string;
}

const STATUS_META: Record<
  IntakeStatus,
  { label: string; badge: string; dot: string }
> = {
  waiting: {
    label: "Waiting",
    badge: "bg-secondary text-secondary-foreground",
    dot: "bg-primary",
  },
  called: {
    label: "Called",
    badge: "bg-accent text-accent-foreground",
    dot: "bg-primary",
  },
  in_progress: {
    label: "In progress",
    badge: "bg-primary/15 text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-destructive",
  },
};

function waitedLabel(createdAt: string): string {
  const start = new Date(createdAt).getTime();
  const mins = Math.max(0, Math.round((Date.now() - start) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function StaffQueuePage() {
  const { config, loading: configLoading } = useConfigurables();
  const appName = config?.appName ?? "IntakeFlow";
  const logoUrl = config?.logoUrl ?? "";
  const title = config?.staffQueueTitle ?? "Patient intake queue";
  const refreshSeconds = config?.queueRefreshSeconds ?? 15;

  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const includeClosedRef = useRef(includeClosed);
  includeClosedRef.current = includeClosed;

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    const response = await apiGet<QueueItem[]>("/api/intake/queue", {
      includeClosed: includeClosedRef.current ? "true" : "false",
    });
    if (response.success && response.data) {
      setItems(response.data);
      setError(null);
    } else {
      setError(response.message ?? "Could not load the queue.");
    }
    if (showSpinner) setLoading(false);
  }, []);

  // Initial + on includeClosed change.
  useEffect(() => {
    load(true);
  }, [load, includeClosed]);

  // Auto-refresh on the configured interval.
  useEffect(() => {
    const ms = Math.max(5, refreshSeconds) * 1000;
    const id = setInterval(() => load(false), ms);
    return () => clearInterval(id);
  }, [load, refreshSeconds]);

  async function setStatus(id: string, status: IntakeStatus) {
    setBusyId(id);
    const response = await apiRequest(`/api/intake/${id}/status`, {
      method: "PATCH",
      data: { status },
    });
    setBusyId(null);
    if (!response.success) {
      setError(response.message ?? "Could not update status.");
      return;
    }
    await load(false);
  }

  const activeCount = items.filter((i) =>
    ["waiting", "called", "in_progress"].includes(i.status),
  ).length;

  if (configLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark appName={appName} logoUrl={logoUrl} tagline="Staff console" />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground">
              <Users className="h-4 w-4" aria-hidden="true" />
              {activeCount} in queue
            </span>
            <button
              type="button"
              onClick={() => load(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-refreshes every {Math.max(5, refreshSeconds)}s. Front of the
              line is longest-waiting.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={includeClosed}
              onChange={(e) => setIncludeClosed(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            Show completed &amp; cancelled
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Check className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-base font-medium text-card-foreground">
              No one is waiting right now.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              New check-ins will appear here automatically.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <QueueRow
                key={item._id}
                item={item}
                position={index + 1}
                busy={busyId === item._id}
                onSetStatus={setStatus}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function QueueRow({
  item,
  position,
  busy,
  onSetStatus,
}: {
  item: QueueItem;
  position: number;
  busy: boolean;
  onSetStatus: (id: string, status: IntakeStatus) => void;
}) {
  const meta = STATUS_META[item.status];
  const closed = item.status === "completed" || item.status === "cancelled";

  return (
    <li
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        closed && "opacity-70",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-base font-bold text-secondary-foreground">
            {position}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-card-foreground">
                {item.fullName}
              </h3>
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground">
                {item.reference}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  meta.badge,
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", meta.dot)}
                  aria-hidden="true"
                />
                {meta.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-card-foreground">
              {item.reasonForVisit}
            </p>
            {item.notes ? (
              <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {item.phone}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                waited {waitedLabel(item.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {!closed ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {item.status === "waiting" ? (
              <ActionBtn
                onClick={() => onSetStatus(item._id, "called")}
                busy={busy}
                icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                label="Call"
                variant="primary"
              />
            ) : null}
            {item.status !== "in_progress" ? (
              <ActionBtn
                onClick={() => onSetStatus(item._id, "in_progress")}
                busy={busy}
                icon={<Stethoscope className="h-4 w-4" aria-hidden="true" />}
                label="Start"
                variant="primary"
              />
            ) : null}
            <ActionBtn
              onClick={() => onSetStatus(item._id, "completed")}
              busy={busy}
              icon={<Check className="h-4 w-4" aria-hidden="true" />}
              label="Done"
              variant="ghost"
            />
            <ActionBtn
              onClick={() => onSetStatus(item._id, "cancelled")}
              busy={busy}
              icon={<X className="h-4 w-4" aria-hidden="true" />}
              label="No-show"
              variant="ghost"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function ActionBtn({
  onClick,
  busy,
  icon,
  label,
  variant,
}: {
  onClick: () => void;
  busy: boolean;
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:brightness-105"
          : "border border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
