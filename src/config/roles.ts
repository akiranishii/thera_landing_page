/** Optional "primary role" choices on the waitlist form. Shared by the form and the API validator. */
export const roles = [
  { value: "investor", label: "Investor" },
  { value: "founder", label: "Founder" },
  { value: "researcher_engineer", label: "Researcher / Engineer" },
  { value: "community_builder", label: "Community Builder" },
  { value: "other", label: "Other" },
] as const;

export type Role = (typeof roles)[number]["value"];

export const roleValues: readonly string[] = roles.map((r) => r.value);

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roleValues.includes(value);
}
