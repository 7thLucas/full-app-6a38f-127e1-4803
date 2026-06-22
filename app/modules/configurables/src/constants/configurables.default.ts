/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TExpectItem = {
  icon: string;
  title: string;
  description: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // Landing page content
  tagline?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  primaryCtaLabel?: string;
  ctaHelperText?: string;
  expectSectionTitle?: string;
  expectItems?: TExpectItem[];
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "IntakeFlow",
  logoUrl: "",
  brandColor: {
    // Base — soft off-white surface, deep slate text
    background:        "#f6fbfb",
    foreground:        "#0f172a",
    // Card — clean white cards on the soft surface
    card:              "#ffffff",
    cardForeground:    "#0f172a",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0f172a",
    // Primary — calm teal
    primary:           "#0d9488",
    primaryForeground: "#ffffff",
    // Secondary — soft teal tint
    secondary:           "#e6f7f5",
    secondaryForeground: "#0f766e",
    // Muted — quiet slate
    muted:           "#eef2f5",
    mutedForeground: "#64748b",
    // Accent — soft teal accent
    accent:           "#ccf3ee",
    accentForeground: "#0f766e",
    // Destructive
    destructive:           "#ef4444",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#e2e8f0",
    input:  "#e2e8f0",
    ring:   "#0d9488",
    // Charts
    chart1: "#0d9488",
    chart2: "#14b8a6",
    chart3: "#0f766e",
    chart4: "#5eead4",
    chart5: "#0e7490",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#ffffff",
    sidebarForeground:        "#0f172a",
    sidebarPrimary:           "#0d9488",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#e6f7f5",
    sidebarAccentForeground:  "#0f766e",
    sidebarBorder:            "#e2e8f0",
    sidebarRing:              "#0d9488",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  // ── Landing page content ──────────────────────────────────────────────
  tagline: "The calm, no-paperwork front desk.",
  heroHeadline: "Welcome — let's get you checked in.",
  heroSubtext:
    "Complete your intake from your own phone before you arrive. No clipboard, no callbacks — just a calm few minutes, and you're set.",
  primaryCtaLabel: "Begin intake",
  ctaHelperText: "Takes about 2 minutes · Your details stay private",
  expectSectionTitle: "What to expect",
  expectItems: [
    {
      icon: "clock",
      title: "A couple of minutes",
      description:
        "A short, simple form. Just your details and the reason for your visit — nothing more.",
    },
    {
      icon: "phone",
      title: "From your own phone",
      description:
        "Fill it in wherever you are, before you arrive. No app to download, no paperwork at the desk.",
    },
    {
      icon: "shield",
      title: "Your details stay private",
      description:
        "Your information is handled with care and shared only with your care team.",
    },
    {
      icon: "message",
      title: "A confirmation when it's received",
      description:
        "Once you're done, you'll get a confirmation so you know the clinic has you. Nothing left to chase.",
    },
  ],
  footerText:
    "Your privacy matters. Information you share is used only to prepare for your visit.",
};
