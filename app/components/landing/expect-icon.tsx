import { Clock, Phone, ShieldCheck, MessageSquareText, CircleCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Maps the owner-configurable icon key (from configurables `expectItems[].icon`)
 * to a Lucide icon. Falls back to a neutral check icon for unknown keys so the
 * owner can never break the UI by mistyping an icon name.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  phone: Phone,
  shield: ShieldCheck,
  message: MessageSquareText,
};

export function ExpectIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? CircleCheck;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
