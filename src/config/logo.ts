/**
 * The thera. mark: "Caldera and Sunken Head".
 *
 * A disc split by a goddess profile looking right. The ink crescent in front of her face is the
 * cliffs of Thera (Santorini), the half behind the profile is the sunken head (the caldera sea),
 * and the knocked-out dot is the island she looks toward. Source files and construction notes:
 * design/logos/final/profile-crescent/. All paths use a 64-unit viewBox.
 */
export const logo = {
  viewBox: "0 0 64 64",
  /** Ink crescent with the island dot knocked out (use fill-rule="evenodd"). */
  crescent:
    "M 26.31 4.59 A 28 28 0 1 1 35.32 59.8 A 4 4 0 0 1 30.97 54.86 L 31.4 53.13 A 8.5 8.5 0 0 0 30.3 41.5 L 29.9 36.7 L 33.68 34.06 A 2 2 0 0 0 34.26 31.41 L 25.8 17 A 25.1 25.1 0 0 0 23.55 10.3 A 4 4 0 0 1 26.31 4.59 Z M 41.1 28 A 5.2 5.2 0 1 1 51.5 28 A 5.2 5.2 0 1 1 41.1 28 Z",
  /** The sunken head: exact complement of the crescent inside the disc. */
  head:
    "M 35.32 59.8 A 28 28 0 0 1 26.31 4.59 A 4 4 0 0 0 23.55 10.3 A 25.1 25.1 0 0 1 25.8 17 L 34.26 31.41 A 2 2 0 0 1 33.68 34.06 L 29.9 36.7 L 30.3 41.5 A 8.5 8.5 0 0 1 31.4 53.13 L 30.97 54.86 A 4 4 0 0 0 35.32 59.8 Z",
  /** 16 px version: no dot, no lip or chin, cut to the 16 px grid. Use at 16–32 px only. */
  small:
    "M 18.63 4.52 A 28 28 0 1 1 24 60 A 4 4 0 0 1 20 56 L 20 36 L 26.03 32.98 A 2 2 0 0 0 26.83 30.13 L 18 16 A 21.79 21.79 0 0 0 15.88 10.35 A 4 4 0 0 1 18.63 4.52 Z",
  colors: {
    ink: "#223848",
    sea: "#8DA8BB",
    light: "#F7F9FA",
    dark: "#1C2E3D",
  },
} as const;
