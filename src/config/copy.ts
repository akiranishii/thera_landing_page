import { brand } from "./brand";

/**
 * All marketing copy for the homepage, in page order.
 * Keep prose here so the components stay purely presentational.
 */
export const nav = {
  links: [
    { label: "Product", href: "#product" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Philosophy", href: "#philosophy" },
  ],
  cta: { label: "Get Early Access", href: "#early-access" },
} as const;

export const hero = {
  eyebrow: brand.tagline.toUpperCase(),
  /** The last word is set in the editorial serif. */
  headline: { lead: "Your network,", emphasis: "in motion." },
  supporting:
    "The AI-powered personal CRM that remembers who you know, helps you discover who's around, and makes meaningful connections happen.",
  underline: "Less time managing contacts. More time with the people who matter.",
  primaryCta: { label: "Get Early Access", href: "#early-access" },
  secondaryCta: { label: "See How It Works", href: "#demo" },
  illustrativeLabel: "Illustrative product concept · example people are fictional",
} as const;

export const problem = {
  eyebrow: "THE PROBLEM",
  headline: "You meet remarkable people. Staying connected is the hard part.",
  body: "Over time, your network becomes one of the most valuable parts of your life. But conversations get forgotten, contacts become scattered, and opportunities to reconnect pass unnoticed.",
  pains: [
    {
      title: "People slip through the cracks.",
      body: "You remember the conversation, but not always the details, follow-up, or last time you spoke.",
    },
    {
      title: "You're in the same city, but never meet.",
      body: "You discover someone was nearby only after you've already left.",
    },
    {
      title: "Your network is bigger than your memory.",
      body: "You know people who could help each other, but connecting the dots takes time.",
    },
  ],
  transition: "Your relationships deserve something better than another contacts list.",
} as const;

export const features = {
  eyebrow: "MEET YOUR RELATIONSHIP ASSISTANT",
  headline: "The people you know. The moments that matter.",
  remember: {
    label: "Remember everyone",
    headline: "Every relationship, thoughtfully remembered.",
    body: `Keep your contacts, conversations, notes, meetings, and follow-ups together. ${brand.name} helps you pick up exactly where you left off.`,
    voiceNote:
      "Met Maya today. She's exploring robotics applications in healthcare. Introduce her to Alex next month.",
    disclaimer: "Demonstration of a proposed feature, not live speech transcription.",
  },
  around: {
    label: "Know who's around",
    headline: "Never miss a chance to meet.",
    body: "Traveling to a new city? See who you know there, who has shared an upcoming visit, and which relationships are worth reconnecting with.",
    disclaimer:
      "Fictional demonstration counts. Presence is based on home city and voluntarily shared trips, never on tracking anyone's location.",
  },
  meet: {
    label: "Make the meeting happen",
    headline: "From “we should catch up” to actually catching up.",
    body: "Find the right time, suggest a convenient place, and coordinate your calendars — without endless back-and-forth.",
    suggestion:
      "You're already near South Park on Thursday. Want to propose coffee with Alex at 12:30?",
    reviewCta: "Review suggestion",
    previewCta: "Preview calendar",
    disclaimer: "Demonstration only. Nothing is sent and no calendar is changed.",
  },
} as const;

export const demo = {
  eyebrow: `SEE ${brand.name.toUpperCase()} IN ACTION`,
  headline: { lead: "Just ask.", emphasis: `${brand.name} connects the dots.` },
  supporting:
    "Your relationships, calendar, and context — brought together in one simple conversation.",
  label: "Interactive concept preview",
  replay: "Replay",
  micHint: "Illustrative microphone. Voice input is not live on this page.",
} as const;

export const discover = {
  eyebrow: "BEYOND YOUR EXISTING NETWORK",
  headline: "The right people aren't always the most visible.",
  body: "Discover people through what they've actually built, the problems they've solved, and the expertise they bring — not just titles, followers, or credentials.",
  capabilities: [
    {
      title: "Understand expertise",
      body: "Explore important projects, research, technical contributions, and demonstrated achievements.",
      icon: "expertise",
    },
    {
      title: "Find trusted paths",
      body: "See relevant mutual connections and ask for introductions when appropriate.",
      icon: "paths",
    },
    {
      title: "Connect with purpose",
      body: "Understand why a meeting might be valuable for both people.",
      icon: "purpose",
    },
  ],
  disclaimer: "Illustrative profile. The person, projects and publication are fictional.",
} as const;

export const howItWorks = {
  eyebrow: "EFFORTLESS BY DESIGN",
  headline: "Your relationships, without the administrative work.",
  steps: [
    {
      number: "01",
      title: "Connect",
      body: "Connect supported contacts, email accounts, and calendars.",
      note: "Integrations are planned and will be listed as they become available.",
    },
    {
      number: "02",
      title: "Remember",
      body: "Bring relationship context, conversations, and follow-ups into one place.",
    },
    {
      number: "03",
      title: "Discover",
      body: "Find relevant opportunities to reconnect, meet, or make thoughtful introductions.",
    },
    {
      number: "04",
      title: "Meet",
      body: "Review personalized outreach suggestions and coordinate real-world meetings.",
    },
  ],
} as const;

export const philosophy = {
  eyebrow: "A DIFFERENT KIND OF NETWORK",
  headline: { lead: "Not more connections.", emphasis: "Better ones." },
  paragraphs: [
    "We don't believe the value of your network should be measured by followers, connection counts, or how many people know your name.",
    "We believe it should be measured by the relationships you build, the people you help, and the meaningful things you create together.",
    `${brand.name} is designed to help people spend less time networking online and more time connecting in the real world.`,
  ],
  principles: [
    {
      title: "Quality over quantity",
      body: "Meaningful connections matter more than collecting contacts.",
    },
    {
      title: "Trust over attention",
      body: "Thoughtful introductions matter more than public popularity.",
    },
    {
      title: "Real life over endless scrolling",
      body: "The best outcome is a conversation, not another notification.",
    },
  ],
} as const;

export const privacy = {
  eyebrow: "TRUST AND PRIVACY",
  headline: "Your relationships are yours.",
  intro: `${brand.name} is being designed around a simple idea: the notes you keep about the people in your life are personal. This is the privacy model we are building toward.`,
  principles: [
    {
      title: "Private by default",
      body: "Your CRM notes stay private unless you decide otherwise.",
    },
    {
      title: "Nothing shared automatically",
      body: "Contact information and relationship details are never shared with other users on their own.",
    },
    {
      title: "Travel sharing is opt-in",
      body: "Sharing an upcoming trip is an explicit choice you make, each time, with the people you choose.",
    },
    {
      title: "You decide what and with whom",
      body: "You control what you share and who can see it.",
    },
    {
      title: "Introductions need a yes",
      body: "An introduction only happens with the appropriate approval from the people involved.",
    },
    {
      title: "Inspect and manage your data",
      body: "You should be able to see, edit, export, and delete the relationship data you keep.",
    },
  ],
  footnote:
    "These principles describe how the product is intended to work. We will publish specific operational details as each one ships.",
} as const;

export const earlyAccess = {
  eyebrow: "JOIN THE EARLY COMMUNITY",
  headline: { lead: "Make more time for the", emphasis: "people who matter." },
  supporting: `${brand.name} is being built for investors, founders, builders, and connectors who believe great relationships deserve more attention.`,
  cta: "Get Early Access",
  form: {
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    roleLabel: "Primary role (optional)",
    rolePlaceholder: "Select a role",
    submit: "Join Early Access",
    submitting: "Joining…",
    success: `You're on the list. We'll reach out when there's an opportunity to try ${brand.name}.`,
    alreadyOnList: `You're already on the list. We'll reach out when there's an opportunity to try ${brand.name}.`,
    privacyNote: "We'll only use your email to contact you about early access.",
  },
} as const;

export const footer = {
  links: [
    { label: "Product", href: "#product" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Early Access", href: "#early-access" },
    { label: "Privacy", href: "#privacy" },
  ],
  contactLabel: "Contact",
  phrase: "More meaningful connections. More life together.",
} as const;
