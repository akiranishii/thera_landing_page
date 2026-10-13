/**
 * Sample content for every product visualization on the page.
 * Every person, company, project and count here is fictional.
 */

export type Presence = "based" | "visiting" | "unconfirmed";

export const presenceLabel: Record<Presence, string> = {
  based: "Based in this city",
  visiting: "Shared upcoming visit",
  unconfirmed: "Location unconfirmed",
};

/** Index into the avatar palette (see Avatar component). */
export type Tone = 0 | 1 | 2 | 3 | 4;

export interface Person {
  id: string;
  name: string;
  role: string;
  tone: Tone;
  presence: Presence;
  /** Short line under the role, e.g. "Based in San Francisco" or "Shared trip to SF: Oct 15–17". */
  presenceDetail: string;
  /** Optional secondary line, e.g. "Last met: 4 months ago". */
  meta?: string;
  action: string;
}

export const people = {
  alex: {
    id: "alex",
    name: "Alex Chen",
    role: "AI infrastructure founder",
    tone: 0,
    presence: "based",
    presenceDetail: "Based in San Francisco",
    meta: "Last met: 4 months ago",
    action: "Catch up",
  },
  maya: {
    id: "maya",
    name: "Maya Rivera",
    role: "Robotics researcher",
    tone: 1,
    presence: "visiting",
    presenceDetail: "Shared trip to SF: Oct 15–17",
    action: "Meet while she's here",
  },
  jordan: {
    id: "jordan",
    name: "Jordan Lee",
    role: "Product builder",
    tone: 2,
    presence: "unconfirmed",
    presenceDetail: "Potential warm introduction",
    action: "Request intro",
  },
} as const satisfies Record<string, Person>;

/* ---------- Hero ---------- */

export const heroScreen = {
  title: "Who's around?",
  city: "San Francisco",
  contacts: [people.alex, people.maya, people.jordan] as Person[],
  voicePrompt: "I'm in SF Thursday. Who should I see?",
  calendar: {
    day: "Thursday",
    items: [
      { time: "11:00", label: "Meeting in SoMa", kind: "meeting" },
      { time: "12:30", label: "Available for coffee", kind: "free" },
      { time: "2:00", label: "Founder meeting", kind: "networking" },
    ],
  },
  recommendation:
    "You're already in SoMa on Thursday. Alex is based nearby. Want to reach out?",
} as const;

/* ---------- Feature 1: contact profile ---------- */

export const contactProfile = {
  name: "Maya Rivera",
  role: "Robotics researcher",
  tone: 1 as Tone,
  city: "Boston",
  lastInteraction: "June 12 · Coffee in Cambridge",
  notes: [
    "Exploring how robotics could support hospital logistics.",
    "Prefers early-morning meetings; often in SF in the fall.",
  ],
  interests: ["Robotics", "Healthcare", "Open-source tooling", "Trail running"],
  followUps: [{ title: "Send the manipulation benchmark paper", due: "This week" }],
  timeline: [
    { date: "Mar 4", label: "Met at a robotics meetup" },
    { date: "Jun 12", label: "Coffee in Cambridge" },
  ],
  /** What the voice note adds, once "transcribed". */
  fromVoiceNote: {
    note: "Exploring robotics applications in healthcare.",
    followUp: { title: "Introduce Maya to Alex Chen", due: "Next month" },
    timeline: { date: "Today", label: "Voice note added" },
    lastInteraction: "Today · Voice note",
  },
} as const;

/* ---------- Feature 2: cities ---------- */

export interface CityOption {
  id: string;
  name: string;
  short: string;
  count: number;
  contacts: Person[];
}

export const cities: CityOption[] = [
  {
    id: "sf",
    name: "San Francisco",
    short: "SF",
    count: 8,
    contacts: [
      people.alex,
      people.maya,
      {
        id: "jordan-sf",
        name: "Jordan Lee",
        role: "Product builder",
        tone: 2,
        presence: "unconfirmed",
        presenceDetail: "Last known: Bay Area",
        meta: "Potential warm introduction",
        action: "Request intro",
      },
    ],
  },
  {
    id: "nyc",
    name: "New York",
    short: "NYC",
    count: 12,
    contacts: [
      {
        id: "priya",
        name: "Priya Natarajan",
        role: "Seed-stage investor",
        tone: 3,
        presence: "based",
        presenceDetail: "Based in New York",
        meta: "Last met: 2 months ago",
        action: "Catch up",
      },
      {
        id: "sam",
        name: "Sam Okafor",
        role: "Climate-tech founder",
        tone: 4,
        presence: "visiting",
        presenceDetail: "Shared trip to NYC: Oct 22–24",
        action: "Meet while he's here",
      },
      {
        id: "elena",
        name: "Elena Fischer",
        role: "Design lead",
        tone: 1,
        presence: "unconfirmed",
        presenceDetail: "Last known: New York",
        meta: "You offered to share a designer intro",
        action: "Follow up",
      },
    ],
  },
  {
    id: "bos",
    name: "Boston",
    short: "BOS",
    count: 6,
    contacts: [
      {
        id: "daniel",
        name: "Daniel Park",
        role: "Biotech researcher",
        tone: 2,
        presence: "based",
        presenceDetail: "Based in Boston",
        meta: "Last met: 7 months ago",
        action: "Reconnect",
      },
      {
        id: "lucia",
        name: "Lucia Moreno",
        role: "ML engineer",
        tone: 0,
        presence: "visiting",
        presenceDetail: "Shared trip to Boston: Nov 3–5",
        action: "Meet while she's here",
      },
      {
        id: "theo",
        name: "Theo Walsh",
        role: "Community organizer",
        tone: 3,
        presence: "unconfirmed",
        presenceDetail: "Last known: Cambridge",
        meta: "Mentioned a founders dinner",
        action: "Say hello",
      },
    ],
  },
];

/* ---------- Feature 3: calendar week ---------- */

export type EventKind = "meeting" | "personal" | "networking" | "travel" | "proposed";

export interface CalendarEvent {
  id: string;
  day: number; // 0 = Monday
  start: number; // hour, decimal (9.5 = 9:30)
  end: number;
  title: string;
  kind: EventKind;
}

export const calendarWeek = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  dates: [13, 14, 15, 16, 17],
  startHour: 9,
  endHour: 17,
  focusDay: 3,
  events: [
    { id: "e1", day: 0, start: 9.5, end: 10.5, title: "Team sync", kind: "meeting" },
    { id: "e2", day: 0, start: 14, end: 15, title: "Portfolio review", kind: "meeting" },
    { id: "e3", day: 1, start: 12, end: 13, title: "Lunch with Sam", kind: "networking" },
    { id: "e4", day: 1, start: 16, end: 17, title: "Gym", kind: "personal" },
    { id: "e5", day: 2, start: 10, end: 11.5, title: "Design review", kind: "meeting" },
    { id: "e6", day: 2, start: 13, end: 14, title: "Dentist", kind: "personal" },
    { id: "e7", day: 3, start: 9, end: 9.75, title: "Travel to SoMa", kind: "travel" },
    { id: "e8", day: 3, start: 11, end: 12, title: "Meeting in SoMa", kind: "meeting" },
    { id: "e9", day: 3, start: 14, end: 15, title: "Founder meeting", kind: "networking" },
    { id: "e10", day: 4, start: 10, end: 11, title: "Hiring call", kind: "meeting" },
    { id: "e11", day: 4, start: 15, end: 16, title: "School pickup", kind: "personal" },
  ] as CalendarEvent[],
  proposed: {
    id: "proposed",
    day: 3,
    start: 12.5,
    end: 13.25,
    title: "Coffee with Alex",
    kind: "proposed",
  } as CalendarEvent,
  proposal: {
    title: "Coffee with Alex Chen",
    when: "Thursday, 12:30 – 1:15 pm",
    where: "Café near South Park, SoMa",
    travel: "6 min walk from your 11:00 meeting",
    buffer: "Leaves 45 min before your 2:00 founder meeting",
    message:
      "Hi Alex — I'll be in SoMa on Thursday. Coffee at 12:30 near South Park?",
  },
} as const;

/* ---------- Interactive demo scenarios ---------- */

export type ScenarioId = "location" | "memory" | "discover";

export interface TalentProfile {
  id: string;
  name: string;
  tone: Tone;
  headline: string;
  specialization: string;
  contribution: string;
  evidence: { label: string; verified: boolean };
  mutual: string;
  why: string;
  fit: "verified" | "inferred";
}

export const talentProfiles: TalentProfile[] = [
  {
    id: "naomi",
    name: "Naomi Okonkwo",
    tone: 4,
    headline: "Research scientist · robotics foundation models",
    specialization: "Robot manipulation and evaluation",
    contribution: "Built an open-source manipulation evaluation system",
    evidence: { label: "Public code repository (example)", verified: true },
    mutual: "Maya Rivera (collaborator)",
    why: "Her evaluation work overlaps with the healthcare robotics problems Maya is exploring.",
    fit: "verified",
  },
  {
    id: "felix",
    name: "Felix Brandt",
    tone: 2,
    headline: "Engineer · sim-to-real transfer",
    specialization: "Tactile sensing and simulation",
    contribution: "Co-authored a tactile sensing dataset and benchmark",
    evidence: { label: "Technical publication (example)", verified: true },
    mutual: "Alex Chen (former colleague)",
    why: "Likely interested in deployment infrastructure, which Alex's company works on.",
    fit: "inferred",
  },
  {
    id: "ines",
    name: "Inés Carvalho",
    tone: 1,
    headline: "Founder · low-cost robotic actuators",
    specialization: "Open hardware and actuation",
    contribution: "Published open hardware designs for a low-cost gripper",
    evidence: { label: "Project page (example)", verified: true },
    mutual: "No direct path yet · 2nd degree via Jordan Lee",
    why: "Her hardware could pair with the evaluation tooling in your network.",
    fit: "inferred",
  },
];

export interface Scenario {
  id: ScenarioId;
  label: string;
  prompt: string;
  response: string;
}

export const scenarios: Scenario[] = [
  {
    id: "location",
    label: "Who's around",
    prompt: "I'm going to San Francisco on Thursday. Who should I catch up with?",
    response:
      "Here are three people in your network worth reconnecting with. Two are based in SF, and one has shared an upcoming visit. I've also found an open window in your Thursday afternoon.",
  },
  {
    id: "memory",
    label: "Relationship memory",
    prompt: "What did Maya and I discuss last time?",
    response:
      "You last met Maya in June. You discussed robotics in healthcare, and you offered to introduce her to a product leader working in medical devices.",
  },
  {
    id: "discover",
    label: "New connections",
    prompt: "Find exceptional technical builders working on robotics I should meet.",
    response:
      "Here are a few relevant people based on their technical work, current interests, and potential introduction paths.",
  },
];

export const scenarioLocation = {
  contacts: [
    { ...people.alex },
    {
      id: "jordan-based",
      name: "Jordan Lee",
      role: "Product builder",
      tone: 2 as Tone,
      presence: "based" as Presence,
      presenceDetail: "Based in San Francisco",
      meta: "Last met: 9 months ago",
      action: "Catch up",
    },
    { ...people.maya },
  ] as Person[],
  availability: {
    day: "Thursday",
    slots: [
      { time: "11:00", label: "Meeting in SoMa", kind: "meeting" as const },
      { time: "12:30", label: "Open window · 45 min", kind: "free" as const },
      { time: "2:00", label: "Founder meeting", kind: "networking" as const },
    ],
  },
};

export const scenarioMemory = {
  person: { name: "Maya Rivera", role: "Robotics researcher", tone: 1 as Tone },
  timeline: [
    { date: "Mar 4", label: "Met at a robotics meetup", detail: "Talked about simulation tooling." },
    {
      date: "Jun 12",
      label: "Coffee in Cambridge",
      detail: "Robotics in healthcare. You offered an intro to a medical-devices product leader.",
    },
  ],
  followUp: {
    title: "Introduce Maya to a product leader in medical devices",
    status: "Outstanding since June",
  },
};

/* ---------- Section 6: researcher profile ---------- */

export const researcherProfile = {
  name: "Naomi Okonkwo",
  tone: 4 as Tone,
  title: "Research scientist",
  rows: [
    { label: "Technical focus", value: "Robotics foundation models" },
    {
      label: "Notable contribution",
      value: "Built an open-source manipulation evaluation system",
    },
    { label: "Current interests", value: "Simulation, real-world deployment" },
    { label: "Research evidence", value: "Example technical publication", verified: true },
    { label: "Introduction path", value: "Through a mutual collaborator" },
  ],
  why: "Why meet: her evaluation tooling is directly relevant to the robotics problems two people in your network are working on.",
};
