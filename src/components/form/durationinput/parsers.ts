import { Temporal } from "@js-temporal/polyfill";

/**
 * Duration parsing/formatting mode.
 * - "designator": Uses the standard Y/M/D designator format. Weeks are converted to days.
 * - "weeks": Uses the exclusive weeks format. Y/M/D units are ignored.
 */
export type DurationMode = "designator" | "weeks";

/**
 * A constant representing zero duration parts.
 */
const ZERO: Readonly<Temporal.DurationLike> = Object.freeze({
  years: 0,
  months: 0,
  days: 0,
  weeks: 0,
});

/**
 * Parses an ISO8601 duration string based on the specified mode.
 * - If the input is blank or invalid, returns zeros.
 * - In "weeks" mode, extracts only weeks.
 * - In "designator" mode, converts weeks to days and combines with Y/M/D.
 *
 * @param mode
 * @param iso
 * @returns The parsed parts.
 *
 * @example
 * parseByMode("designator", "P1Y2M3D") // => { years: 1, months: 2, days: 3, weeks: 0 }
 * parseByMode("designator", "P4W") // => { years: 0, months: 0, days: 28, weeks: 0 }
 * parseByMode("weeks", "P4W") // => { years: 0, months: 0, days: 0, weeks: 4 }
 * parseByMode("weeks", "P1Y2M3D") // => { years: 0, months: 0, days: 0, weeks: 0 }
 * parseByMode("designator", "") // => { years: 0, months: 0, days: 0, weeks: 0 }
 * parseByMode("weeks", null) // => { years: 0, months: 0, days: 0, weeks: 0 }
 */
export function parseByMode(
  mode: DurationMode,
  iso?: string | null,
): Temporal.DurationLike {
  if (!iso) return ZERO;

  const { years, months, days, weeks } = Temporal.Duration.from(iso);

  // P3W
  if (mode === "weeks") {
    return { years: 0, months: 0, days: 0, weeks };
  }
  // P1Y2M3D + P4W (Convert weeks to days)
  const day = days + weeks * 7;
  if (years === 0 && months === 0 && day === 0) return ZERO;
  return { years, months, days: day, weeks: 0 };
}

/**
 * Formats an ISO8601 duration string based on the specified mode and parts.
 * @param mode
 * @param parts
 */
export function formatByMode(
  mode: DurationMode,
  parts: Temporal.DurationLike,
): string {
  const { years, months, days, weeks } = parts;

  if (mode === "weeks") {
    return new Temporal.Duration(0, 0, weeks).toString();
  }

  if (weeks !== 0) {
    return new Temporal.Duration(0, 0, weeks).toString();
  }

  return new Temporal.Duration(years, months, 0, days).toString();
}
